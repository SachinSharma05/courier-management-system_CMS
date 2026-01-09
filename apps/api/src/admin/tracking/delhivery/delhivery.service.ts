import { Injectable } from '@nestjs/common';
import { db } from '../../../db';
import { consignments, trackingEvents } from '../../../db/schema';
import { eq, inArray, sql } from 'drizzle-orm';
import { DelhiveryBulkAdapter } from '@cms/shared';

@Injectable()
export class DelhiveryService {
  private adapter = new DelhiveryBulkAdapter();

  async processBulk(clientId: number, awbs: string[]) {
    if (!awbs?.length) {
      return { ok: false, message: 'No AWBs provided' };
    }

    // 1️⃣ Dedupe + sanitize
    const uniqueAwbs = [...new Set(awbs.map(a => a.trim()))];

    // 2️⃣ Chunk (Delhivery safe limit)
    const batches = this.chunk(uniqueAwbs, 25);

    const normalized: NormalizedDelhivery[] = [];

    for (const batch of batches) {
      try {
        const json = await this.adapter.trackBulk(batch);
        normalized.push(...this.normalize(json));
      } catch (err) {
        console.error('Delhivery bulk failed', batch, err);
      }
    }

    if (!normalized.length) {
      return { ok: true, processed: 0 };
    }

    // 3️⃣ Deduplicate by AWB (Neon-safe)
    const map = new Map<string, NormalizedDelhivery>();
    for (const n of normalized) {
      if (n.awb) map.set(n.awb, n);
    }

    const finalRows = [...map.values()];

    // 4️⃣ UPSERT consignments (row-by-row)
    for (const n of finalRows) {
      await db
        .insert(consignments)
        .values({
          awb: n.awb,
          provider: 'DELHIVERY',
          client_id: clientId,
          current_status: n.current_status,
          origin: n.origin,
          destination: n.destination,
          reference_number: n.reference_number,
          expected_delivery_date: n.expected_delivery_date,
          invoice_amount: n.invoice_amount.toString(),
          last_status_at: n.last_status_at,
          updated_at: sql`NOW()`,
        })
        .onConflictDoUpdate({
          target: consignments.awb,
          set: {
            current_status: sql`excluded.current_status`,
            origin: sql`excluded.origin`,
            destination: sql`excluded.destination`,
            reference_number: sql`excluded.reference_number`,
            expected_delivery_date: sql`excluded.expected_delivery_date`,
            invoice_amount: sql`excluded.invoice_amount`,
            last_status_at: sql`excluded.last_status_at`,
            updated_at: sql`NOW()`,
          },
        });

      // 5️⃣ Resolve consignment id
      const [row] = await db
        .select({ id: consignments.id })
        .from(consignments)
        .where(eq(consignments.awb, n.awb))
        .limit(1);

      if (!row) continue;

      // 🔴 OVERWRITE EVENTS (safe for Neon)
      await db
        .delete(trackingEvents)
        .where(eq(trackingEvents.consignment_id, row.id));

      if (n.events.length) {
        await db.insert(trackingEvents).values(
          n.events.map(e => ({
            consignment_id: row.id,
            awb: n.awb,
            provider: 'DELHIVERY',
            status: e.status,
            location: e.location,
            remarks: e.remarks,
            event_time: e.event_time,
          })),
        );
      }
    }

    return {
      ok: true,
      total: uniqueAwbs.length,
      processed: finalRows.length,
    };
  }

  /* =======================
     NORMALIZER
  ======================= */
  private normalize(json: any): NormalizedDelhivery[] {
    const data = json?.ShipmentData ?? [];

    return data
      .map((x: any) => {
        const s = x?.Shipment;
        if (!s?.Waybill) return null;

        return {
          awb: s.Waybill,
          origin: s.Origin ?? null,
          destination: s.Destination ?? null,
          reference_number: s.ReferenceNo ?? null,
          current_status: s.Status?.Status ?? null,
          last_status_at: s.Status?.StatusDateTime
            ? new Date(s.Status.StatusDateTime)
            : null,
          expected_delivery_date: s.PromisedDeliveryDate
            ? new Date(s.PromisedDeliveryDate)
            : null,
          invoice_amount: s.InvoiceAmount ?? null,
          events: (s.Scans ?? [])
            .map((sc: any) => {
              const d = sc.ScanDetail;
              if (!d?.ScanDateTime) return null;

              return {
                status: d.Scan ?? '',
                location: d.ScannedLocation ?? null,
                remarks: d.Instructions ?? null,
                event_time: new Date(d.ScanDateTime),
              };
            })
            .filter(Boolean),
        };
      })
      .filter(Boolean);
  }

  private chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
    return out;
  }
}

/* =======================
   TYPES
======================= */
type NormalizedDelhivery = {
  awb: string;
  origin: string | null;
  destination: string | null;
  reference_number: string | null;
  current_status: string | null;
  last_status_at: Date | null;
  expected_delivery_date: Date | null;
  invoice_amount: number | null;
  events: {
    status: string;
    location: string | null;
    remarks: string | null;
    event_time: Date | null;
  }[];
};