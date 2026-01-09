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
import { trackingQueue } from "../../../../../worker/queues/tracking.queue";

function parseDtdcDate(raw: string | null): string | null {
  if (!raw || raw.length !== 8) return null;
  return `${raw.substring(4, 8)}-${raw.substring(2, 4)}-${raw.substring(0, 2)}`;
}

function parseDtdcTime(raw: string | null): string | null {
  if (!raw || raw.length !== 4) return null;
  return `${raw.substring(0, 2)}:${raw.substring(2, 4)}:00`;
}

function parseDtdcDateTime(d: string | null, t: string | null): string | null {
  const date = parseDtdcDate(d);
  const time = parseDtdcTime(t);
  return date && time ? `${date} ${time}` : date;
}

@Injectable()
export class BulkTrackingService {
  constructor(private readonly dtdc: DtdcBulkAdapter) {}

  async processDtdcBulk(groups: BulkGroupDto[]) {
    const results: any[] = [];

    for (const group of groups) {
      const code = group.code.toUpperCase().trim();
      const inputAwbs = [...new Set(group.awbs.map(a => a.trim()))];
      if (!inputAwbs.length) continue;

      const inputAwbSet = new Set(inputAwbs);

      const normalizedByAwb = new Map<string, NormalizedDTDC>();

      /* ----------------------------------
         1️⃣ Resolve client
      ---------------------------------- */
      const credRows = await db
        .select()
        .from(clientCredentials)
        .where(eq(clientCredentials.env_key, "DTDC_CUSTOMER_CODE"));

      const client = credRows.find(
        r => decrypt(r.encrypted_value) === code,
      );

      const clientId = Number(client?.client_id ?? 1);

      /* ----------------------------------
         2️⃣ Load AUTH creds
      ---------------------------------- */
      const creds = await this.loadDtdcCreds(clientId);

      const authAwbs = creds ? [...inputAwbs] : [];
      const publicAwbs: string[] = [];

      /* ======================================================
         🔐 AUTH FIRST (25)
      ====================================================== */
      if (authAwbs.length && creds) {
        const batches = this.chunk(authAwbs, 25);

        for (const batch of batches) {
          try {
            const json = await this.dtdc.trackAuthBatch({
              awbs: batch,
              token: creds.token,
              customerCode: creds.customerCode,
            });

            if (
              json?.status === "FAILED" ||
              json?.statusFlag === false ||
              !json?.trackHeader
            ) {
              publicAwbs.push(...batch);
              continue;
            }

            const rows = this.normalizeAuthResponse(json, batch);
            for (const r of rows) {
              if (!inputAwbSet.has(r.awb)) continue;
              normalizedByAwb.set(r.awb, r); // last-write-wins
            }
          } catch {
            publicAwbs.push(...batch);
          }
        }
      } else {
        publicAwbs.push(...inputAwbs);
      }

      /* ======================================================
         🌐 PUBLIC BATCH SUMMARY (25)
      ====================================================== */
      if (publicAwbs.length) {
        const batches = this.chunk(publicAwbs, 25);

        for (const batch of batches) {
          try {
            const json = await this.dtdc.trackPublicBatch(batch);
            const rows = this.normalizePublicResponse(json, batch);

            for (const r of rows) {
              if (!inputAwbSet.has(r.awb)) continue;
              normalizedByAwb.set(r.awb, r);
            }
          } catch {}
        }
      }

      if (!normalizedByAwb.size) continue;

      const deduped = [...normalizedByAwb.values()];

      /* ======================================================
         3️⃣ UPSERT CONSIGNMENTS (SAFE)
      ====================================================== */
      const UPSERT_CONCURRENCY = 15;

      const upsertJobs = deduped.map(n => async () => {
        await db
          .insert(consignments)
          .values({
            awb: n.awb,
            client_id: clientId,
            provider: "DTDC",
            origin: n.origin,
            destination: n.destination,
            reference_number: n.reference_number,
            service_type: n.service_type,
            origin_pincode: n.origin_pincode,
            destination_pincode: n.destination_pincode,
            booked_at: n.booked_at,
            last_status_at: n.last_status_at,
            current_status: n.current_status,
            updated_at: sql`NOW()`,
          })
          .onConflictDoUpdate({
            target: consignments.awb,
            set: {
              origin: sql`excluded.origin`,
              destination: sql`excluded.destination`,
              current_status: sql`excluded.current_status`,
              last_status_at: sql`excluded.last_status_at`,
              booked_at: sql`excluded.booked_at`,
              provider: sql`excluded.provider`,
              client_id: sql`excluded.client_id`,
              updated_at: sql`NOW()`,
            },
          });
      });

      await this.runWithConcurrency(upsertJobs, UPSERT_CONCURRENCY);

      /* ======================================================
    4️⃣ EVENTS – PUBLIC SINGLE TRACK (Neon-safe)
      ====================================================== */

      // only AWBs that might have a timeline
      const needTimeline = deduped.filter(
        n =>
          n.current_status !== 'NO DATA FOUND' &&
          (!n.events || n.events.length === 0),
      );

      if (needTimeline.length) {
      await trackingQueue.addBulk(
        needTimeline.map(n => ({
          name: 'DTDC_SINGLE_TRACK',
          data: {
            awb: n.awb,
            provider: 'DTDC',
            clientId,
          },
          opts: {
            jobId: `DTDC:${n.awb}`, // 🔴 idempotent
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 60_000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        })),
      );
    }

      results.push({
        code,
        clientId,
        uploaded: inputAwbs.length,
        saved: deduped.length,
      });
    }

    return { ok: true, results };
  }

  /* ======================================================
     NORMALIZERS
  ====================================================== */

  private async runWithConcurrency(
  jobs: (() => Promise<void>)[],
  limit: number,
  ) {
    const executing = new Set<Promise<void>>();

    for (const job of jobs) {
      const p = job().finally(() => executing.delete(p));
      executing.add(p);

      if (executing.size >= limit) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
  }

  private normalizeAuthResponse(json: any, batch: string[]): NormalizedDTDC[] {
    if (!json?.trackHeader) {
      return batch.map(awb => ({
        awb,
        origin: null,
        destination: null,
        reference_number: null,
        service_type: null,
        origin_pincode: null,
        destination_pincode: null,
        booked_at: null,
        current_status: "NO DATA FOUND",
        last_status_at: null,
        events: [],
      }));
    }

    const h = json.trackHeader;
    const details = Array.isArray(json.trackDetails)
      ? json.trackDetails
      : [];

    return [
      {
        awb: String(h.strShipmentNo).trim(),
        origin: h.strOrigin ?? null,
        destination: h.strDestination ?? null,
        reference_number: null,
        service_type: null,
        origin_pincode: null,
        destination_pincode: null,
        booked_at: h.strBookedDate,
        current_status: h.strStatus ?? null,
        last_status_at: h.strStatusTransOn && h.strStatusTransTime,
        events: details.map(d => ({
          status: d.strAction ?? "",
          location: d.strDestination ?? d.strOrigin ?? null,
          remarks: d.strRemarks ?? null,
          event_time: parseDtdcDateTime(
            d.strActionDate,
            d.strActionTime,
          ),
        })),
      },
    ];
  }

  private normalizePublicResponse(json: any, batch: string[]): NormalizedDTDC[] {
    const headers = Array.isArray(json?.headers) ? json.headers : [];
    const found = new Set(headers.map(h => String(h.shipmentNo).trim()));

    const rows: NormalizedDTDC[] = headers.map(h => ({
      awb: String(h.shipmentNo).trim(),
      origin: h.originCity ?? null,
      destination: h.destinationCity ?? null,
      reference_number: h.referenceNo ?? null,
      service_type: h.serviceName ?? h.mode ?? null,
      origin_pincode: h.originPincode ?? null,
      destination_pincode: h.destinationPincode ?? null,
      booked_at:
        h.bookingDate && h.bookingTime
          ? new Date(
              `${h.bookingDate}T${h.bookingTime.replace(".0", "")}`,
            )
          : null,
      current_status: h.currentStatusDescription ?? null,
      last_status_at:
        h.currentStatusDate && h.currentStatusTime
          ? new Date(
              `${h.currentStatusDate}T${h.currentStatusTime.replace(
                ".0",
                "",
              )}`,
            )
          : null,
      events: [],
    }));

    for (const awb of batch) {
      if (!found.has(awb)) {
        rows.push({
          awb,
          origin: null,
          destination: null,
          reference_number: null,
          service_type: null,
          origin_pincode: null,
          destination_pincode: null,
          booked_at: null,
          current_status: "NO DATA FOUND",
          last_status_at: null,
          events: [],
        });
      }
    }

    return rows;
  }

  private normalizePublicSingle(json: any, awb: string) {
    const statuses = Array.isArray(json?.statuses) ? json.statuses : [];
    return statuses.map((s: any) => ({
      status: s.statusDescription ?? "",
      location: s.actCityName ?? s.actBranchName ?? null,
      remarks: s.remarks ?? null,
      event_time: s.statusTimestamp
        ? new Date(s.statusTimestamp.replace(" ", "T"))
        : null,
    }));
  }

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
    for (const r of rows) map[r.env_key] = decrypt(r.encrypted_value);

    if (!map.api_token || !map.DTDC_CUSTOMER_CODE) return null;

    return {
      token: map.api_token,
      customerCode: map.DTDC_CUSTOMER_CODE,
    };
  }
}

type NormalizedDTDC = {
  awb: string;
  origin: string | null;
  destination: string | null;
  reference_number: string | null;
  service_type: string | null;
  origin_pincode: string | null;
  destination_pincode: string | null;
  booked_at: Date | null;
  current_status: string | null;
  last_status_at: Date | null;
  events: {
    status: string;
    location: string | null;
    remarks: string | null;
    event_time: Date | null;
  }[];
};
