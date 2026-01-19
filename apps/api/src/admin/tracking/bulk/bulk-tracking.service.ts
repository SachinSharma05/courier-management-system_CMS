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
import { DtdcBulkAdapter } from '@cms/shared';
import { trackingQueue } from '../../../queues/tracking.queue';
import crypto from 'crypto';

function makeJobId(provider: string, awb: string) {
  return crypto.createHash('sha1').update(`${provider}_${awb}`).digest('hex');
}

function safeDate(input: any): Date | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

@Injectable()
export class BulkTrackingService {
  constructor(private readonly dtdc: DtdcBulkAdapter) {}

  async processDtdcBulk(groups: BulkGroupDto[]) {
    const results: any[] = [];

    for (const group of groups) {
      const customerCode = group.code.trim().toUpperCase();
      const awbs = [...new Set(group.awbs.map(a => a.trim()))];
      if (!awbs.length) continue;

      /* ------------------------------------------------
         1️⃣ Resolve clientId ONCE
      ------------------------------------------------ */
      const credRows = await db
        .select()
        .from(clientCredentials)
        .where(eq(clientCredentials.env_key, 'DTDC_CUSTOMER_CODE'));

      const client = credRows.find(
        r => decrypt(r.encrypted_value) === customerCode,
      );

      const clientId = Number(client?.client_id ?? 1);

      /* ------------------------------------------------
         2️⃣ Load DTDC AUTH creds
      ------------------------------------------------ */
      const creds = await this.loadDtdcCreds(clientId);

      const resolved = new Map<string, NormalizedDTDC>();
      const publicFallback: string[] = [];

      /* ------------------------------------------------
         3️⃣ AUTH batch (25)
      ------------------------------------------------ */
      if (creds) {
        for (const batch of this.chunk(awbs, 25)) {
          try {
            const json = await this.dtdc.trackAuthBatch({
              awbs: batch,
              token: creds.token,
              customerCode: creds.customerCode,
            });

            if (!json?.trackHeader) {
              publicFallback.push(...batch);
              continue;
            }

            const rows = this.normalizeAuthResponse(json, batch);
            for (const r of rows) resolved.set(r.awb, r);
          } catch {
            publicFallback.push(...batch);
          }
        }
      } else {
        publicFallback.push(...awbs);
      }

      /* ------------------------------------------------
         4️⃣ PUBLIC batch summary (25)
      ------------------------------------------------ */
      for (const batch of this.chunk(publicFallback, 25)) {
        try {
          const json = await this.dtdc.trackPublicBatch(batch);
          const rows = this.normalizePublicResponse(json, batch);
          for (const r of rows) resolved.set(r.awb, r);
        } catch {}
      }

      if (!resolved.size) continue;
      const rows = [...resolved.values()];

      /* ------------------------------------------------
         5️⃣ BULK UPSERT (FAST, SAFE)
      ------------------------------------------------ */
      await db
        .insert(consignments)
        .values(
          rows.map(r => ({
            awb: r.awb,
            client_id: clientId,
            provider: 'DTDC',
            origin: r.origin,
            destination: r.destination,
            reference_number: r.reference_number,
            service_type: r.service_type,
            origin_pincode: r.origin_pincode,
            destination_pincode: r.destination_pincode,
            booked_at: safeDate(r.booked_at),
            current_status: r.current_status,
            last_status_at: safeDate(r.last_status_at),
            updated_at: sql`NOW()`,
          }))
        )
        .onConflictDoUpdate({
          target: consignments.awb,
          set: {
            origin: sql`COALESCE(consignments.origin, excluded.origin)`,
            destination: sql`COALESCE(consignments.destination, excluded.destination)`,
            reference_number: sql`COALESCE(consignments.reference_number, excluded.reference_number)`,
            origin_pincode: sql`COALESCE(consignments.origin_pincode, excluded.origin_pincode)`,
            destination_pincode: sql`COALESCE(consignments.destination_pincode, excluded.destination_pincode)`,
            booked_at: sql`COALESCE(consignments.booked_at, excluded.booked_at)`,
            current_status: sql`excluded.current_status`,
            last_status_at: sql`excluded.last_status_at`,
            updated_at: sql`NOW()`,
          },
        });

      /* ------------------------------------------------
         6️⃣ Enqueue SINGLE track ONLY when needed
      ------------------------------------------------ */
      const jobs = rows
        .filter(r => r.current_status && r.current_status !== 'NO DATA FOUND')
        .map(r => ({
          name: 'DTDC_SINGLE_TRACK',
          data: { awb: r.awb },
          opts: {
            jobId: makeJobId('DTDC', r.awb),
            removeOnComplete: true,
            attempts: 3,
          },
        }));

      for (const chunk of this.chunk(jobs, 50)) {
        await trackingQueue.addBulk(chunk);
      }

      results.push({
        customerCode,
        clientId,
        uploaded: awbs.length,
        saved: rows.length,
      });
    }

    return { ok: true, results };
  }

  /* ---------------- Normalizers ---------------- */

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
        current_status: null,
        last_status_at: null,
        events: [],
      }));
    }

    const h = json.trackHeader;

    return [{
      awb: String(h.strShipmentNo).trim(),
      origin: h.strOrigin ?? null,
      destination: h.strDestination ?? null,
      reference_number: null,
      service_type: null,
      origin_pincode: null,
      destination_pincode: null,
      booked_at: safeDate(h.strBookedDate),
      current_status: h.strStatus ?? null,
      last_status_at: safeDate(h.strStatusTransOn),
      events: [],
    }];
  }

  private normalizePublicResponse(json: any, batch: string[]): NormalizedDTDC[] {
    const headers = Array.isArray(json?.headers) ? json.headers : [];
    const found = new Set(headers.map(h => String(h.shipmentNo)));

    const rows = headers.map(h => ({
      awb: String(h.shipmentNo),
      origin: h.originCity ?? null,
      destination: h.destinationCity ?? null,
      reference_number: h.referenceNo ?? null,
      service_type: h.serviceName ?? null,
      origin_pincode: h.originPincode ?? null,
      destination_pincode: h.destinationPincode ?? null,
      booked_at: safeDate(h.bookingDate),
      current_status: h.currentStatusDescription ?? null,
      last_status_at: safeDate(h.currentStatusDate),
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
          current_status: null,
          last_status_at: null,
          events: [],
        });
      }
    }

    return rows;
  }

  private chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
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

type NormalizedDTDC = 
{ 
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
  events: 
  { 
    status: string; 
    location: string | null; 
    remarks: string | null; 
    event_time: Date | null; 
  }[]; 
};