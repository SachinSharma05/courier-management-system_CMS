import { Injectable } from "@nestjs/common";
import { BulkGroupDto } from "./bulk-tracking.dto";
import { db } from "../../../db";
import {
  clientCredentials,
  consignments,
  trackingEvents,
} from "../../../db/schema";
import { decrypt } from "../../../utils/crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { DtdcBulkAdapter } from "./providers/dtdc.bulk.adapter";

@Injectable()
export class BulkTrackingService {
  constructor(
    private readonly dtdc: DtdcBulkAdapter,
  ) {}

  async processDtdcBulk(groups: BulkGroupDto[]) {
    const results = [];
    for (const group of groups) {
      const code = group.code.toUpperCase().trim();
      const awbs = [...new Set(group.awbs.map(a => a.trim()))];

      if (!awbs.length) continue;

      /* ---------------------------------------------
         1️⃣ Resolve client via DTDC_CUSTOMER_CODE
         (UNCHANGED LOGIC)
      --------------------------------------------- */
      const credRows = await db
        .select()
        .from(clientCredentials)
        .where(eq(clientCredentials.env_key, "DTDC_CUSTOMER_CODE"));

      const client = credRows.find(
        r => decrypt(r.encrypted_value) === code,
      );

      // 🔥 DEFAULT: Super Admin
      const DEFAULT_CLIENT_ID = 1; // Super Admin
      const clientId = Number(client?.client_id ?? DEFAULT_CLIENT_ID);

      console.log("ClientID", clientId);
      /* ---------------------------------------------
         2️⃣ Load DTDC credentials
         👉 if null → PUBLIC fallback (IMPORTANT)
      --------------------------------------------- */
      const creds = await this.loadDtdcCreds(clientId);
      const hasAuthCreds = !!creds;

      /* ---------------------------------------------
         3️⃣ Track in batches (25 AWBs max)
      --------------------------------------------- */
      const batches = this.chunk(awbs, 25);

      const consignmentRows: any[] = [];
      const eventRows: any[] = [];

      for (const batch of batches) {
        const response = await this.dtdc.trackBatch({
          awbs: batch,
          credentials: hasAuthCreds ? creds! : undefined,
        });

        const parsed = this.parseDtdcResponse({
          mode: hasAuthCreds ? 'AUTH' : 'PUBLIC',
          raw: response,
        });

        console.log("Parsed Data", parsed)

        // 🔥 IMPORTANT: never silently skip
        for (const item of parsed) {
          consignmentRows.push({
            ...item.consignment,
            client_id: clientId,
            provider: "DTDC",
            updated_at: sql`NOW()`,
          });

          if (item.events?.length) {
            eventRows.push(
              ...item.events.map(e => ({
                ...e,
                provider: "DTDC",
              })),
            );
          }
        }
      }

      /* ---------------------------------------------
         4️⃣ UPSERT CONSIGNMENTS
      --------------------------------------------- */
      if (consignmentRows.length) {
        await db
          .insert(consignments)
          .values(consignmentRows)
          .onConflictDoUpdate({
            target: consignments.awb,
            set: {
              current_status: sql`excluded.current_status`,
              last_status_at: sql`excluded.last_status_at`,
              origin: sql`excluded.origin`,
              destination: sql`excluded.destination`,
              booked_at: sql`excluded.booked_at`,
              client_id: sql`excluded.client_id`,
              provider: sql`excluded.provider`,
              updated_at: sql`NOW()`,
            },
          });
      }

      /* ---------------------------------------------
         5️⃣ Fetch consignment IDs
      --------------------------------------------- */
      const idRows = await db
        .select({ id: consignments.id, awb: consignments.awb })
        .from(consignments)
        .where(inArray(consignments.awb, awbs));

      const idMap = new Map(idRows.map(r => [r.awb, r.id]));

      /* ---------------------------------------------
         6️⃣ INSERT TRACKING EVENTS
      --------------------------------------------- */
      const finalEvents = eventRows
        .map(e => ({
          consignment_id: idMap.get(e.awb),
          awb: e.awb,
          provider: e.provider,
          status: e.status,
          location: e.location,
          remarks: e.remarks,
          event_time: e.event_time,
        }))
        .filter(e => e.consignment_id);

      if (finalEvents.length) {
        for (const batch of this.chunk(finalEvents, 200)) {
          await db
            .insert(trackingEvents)
            .values(batch)
            .onConflictDoNothing();
        }
      }

      results.push({
        code,
        clientId,
        totalAwbs: awbs.length,
        consignments: consignmentRows.length,
        events: finalEvents.length,
        mode: hasAuthCreds ? 'AUTH' : 'PUBLIC',
      });
    }

    return { ok: true, results };
  }

  /* ---------------------------------------------
     HELPERS (UNCHANGED)
  --------------------------------------------- */
  private chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size)
      out.push(arr.slice(i, i + size));
    return out;
  }

  private async loadDtdcCreds(clientId: number) {
    const rows = await db
      .select()
      .from(clientCredentials)
      .where(eq(clientCredentials.client_id, clientId));

    const map: Record<string, string> = {};
    for (const r of rows) {
      map[r.env_key] = decrypt(r.encrypted_value);
    }

    if (!map.api_token || !map.DTDC_CUSTOMER_CODE) return null;

    return {
      token: map.api_token,
      customerCode: map.DTDC_CUSTOMER_CODE,
    };
  }

  /* ---------------------------------------------
     🔥 PARSER (MINIMAL PATCH)
  --------------------------------------------- */
  private parseDtdcResponse(response: {
    mode: 'AUTH' | 'PUBLIC';
    raw: any;
  }) {
    if (!response?.raw) return [];

    /* -------------------------------
       🔐 AUTH MODE
    -------------------------------- */
    if (response.mode === 'AUTH') {
      const json = response.raw;

      // 🔥 normalize DTDC business failure
      if (
        json?.error === "CLIENT_NOT_FOUND" ||
        json?.status === "FAILED" ||
        json?.statusFlag === false
      ) {
        return (json?.awbList ?? []).map((awb: string) => ({
          consignment: {
            awb,
            provider: 'DTDC',
            origin: null,
            destination: null,
            booked_at: null,
            last_status_at: null,
            current_status: "CLIENT NOT FOUND",
          },
          events: [],
        }));
      }

      const headers = Array.isArray(json.trackHeader)
        ? json.trackHeader
        : json.trackHeader
        ? [json.trackHeader]
        : [];

      const details = Array.isArray(json.trackDetails)
        ? json.trackDetails
        : [];

      const byAwb = new Map<string, any[]>();
      for (const d of details) {
        const awb = String(d.strShipmentNo || '').trim();
        if (!awb) continue;
        const arr = byAwb.get(awb) ?? [];
        arr.push(d);
        byAwb.set(awb, arr);
      }

      return headers.map(h => {
        const awb = String(h.strShipmentNo).trim();

        return {
          consignment: {
            awb,
            provider: 'DTDC',
            origin: h.strOrigin ?? null,
            destination: h.strDestination ?? null,
            booked_at: this.toJsDate(
              this.parseDtdcDate(h.strBookedDate),
              null
            ),
            last_status_at: this.toJsDate(
              this.parseDtdcDate(h.strStatusTransOn),
              this.parseDtdcTime(h.strStatusTransTime)
            ),
            current_status: h.strStatus ?? null,
          },
          events: (byAwb.get(awb) ?? []).map(t => ({
            awb,
            provider: 'DTDC',
            status: t.strAction ?? '',
            location: t.strDestination ?? t.strOrigin ?? null,
            remarks: t.sTrRemarks ?? t.strRemarks ?? null,
            event_time: this.toJsDate(
              this.parseDtdcDate(t.strActionDate),
              this.parseDtdcTime(t.strActionTime)
            ),
          })),
        };
      });
    }

    /* -------------------------------
   🌐 PUBLIC MODE (FIXED)
    -------------------------------- */
    const rows = Array.isArray(response.raw)
      ? response.raw
      : [response.raw];

    return rows.flatMap(r => {
      const statuses = r?.raw?.statuses;
      const header = r?.raw?.header;

      if (!header || !Array.isArray(statuses) || !statuses.length) {
        return [{
          consignment: {
            awb: r.awb,
            provider: 'DTDC',
            origin: null,
            destination: null,
            booked_at: null,
            last_status_at: null,
            current_status: "NO DATA FOUND",
          },
          events: [],
        }];
      }

      const last = statuses[statuses.length - 1];

      return [{
        consignment: {
          awb: r.awb,
          provider: 'DTDC',
          origin: header.originCity ?? null,
          destination: header.destinationCity ?? null,
          booked_at: null,
          last_status_at: this.toJsDate(last.statusTimestamp),
          current_status: header.currentStatusDescription ?? last.statusDescription ?? null,
        },
        events: statuses.map(s => ({
          awb: r.awb,
          provider: 'DTDC',
          status: s.statusDescription ?? '',
          location: s.actCityName ?? s.actBranchName ?? null,
          remarks: s.remarks ?? null,
          event_time: this.toJsDate(s.statusTimestamp),
        })),
      }];
    });
  }

  private parseDtdcDate(raw?: string | null): string | null {
    if (!raw || raw.length !== 8) return null;
    return `${raw.substring(4, 8)}-${raw.substring(2, 4)}-${raw.substring(0, 2)}`;
  }

  private parseDtdcTime(raw?: string | null): string | null {
    if (!raw || raw.length !== 4) return null;
    return `${raw.substring(0, 2)}:${raw.substring(2, 4)}:00`;
  }

  private toJsDate(date?: string | null, time?: string | null): Date | null {
    if (!date) return null;
    const iso = time ? `${date}T${time}` : `${date}T00:00:00`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }
}