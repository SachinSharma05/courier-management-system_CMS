import { Job } from 'bullmq';
import { db } from '../db';
import { consignments, trackingEvents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { DelhiveryBulkAdapter } from '@cms/shared';

const delhivery = new DelhiveryBulkAdapter();

export async function processDelhiverySingleTrack(job: Job) {
  const { awb } = job.data as { awb: string };

  // 1️⃣ Find consignment
  const [row] = await db
    .select({ id: consignments.id })
    .from(consignments)
    .where(eq(consignments.awb, awb))
    .limit(1);

  if (!row) {
    throw new Error(`Consignment not found for ${awb}`);
  }

  const consignmentId = row.id;

  // 2️⃣ Call Delhivery single-track API
  const json = await delhivery.trackSingle(awb);

  const shipment = json?.ShipmentData?.[0]?.Shipment;
  if (!shipment) {
    throw new Error('No shipment data');
  }

  const scans = shipment.Scans ?? [];

  if (!scans.length) {
    throw new Error('No events yet');
  }

  // 3️⃣ Normalize events
  const events = scans
    .map((s: any) => {
      const d = s.ScanDetail;
      if (!d?.ScanDateTime) return null;

      return {
        consignment_id: consignmentId,
        awb,
        provider: 'DELHIVERY',
        status: d.Scan ?? '',
        location: d.ScannedLocation ?? null,
        remarks: d.Instructions ?? null,
        event_time: new Date(d.ScanDateTime),
      };
    })
    .filter(Boolean);

  if (!events.length) {
    throw new Error('No valid events');
  }

  // 4️⃣ OVERWRITE EVENTS (Neon-safe)
  await db
    .delete(trackingEvents)
    .where(eq(trackingEvents.consignment_id, consignmentId));

  await db.insert(trackingEvents).values(events);

  // 5️⃣ Update consignment status
  const latestStatus = shipment.Status?.Status ?? events[0].status;
  const latestTime = shipment.Status?.StatusDateTime
    ? new Date(shipment.Status.StatusDateTime)
    : events[0].event_time;

  await db
    .update(consignments)
    .set({
      current_status: latestStatus,
      last_status_at: latestTime,
    })
    .where(eq(consignments.id, consignmentId));
}