import { Job } from 'bullmq';
import { db } from '../db';
import { consignments, trackingEvents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { DtdcBulkAdapter } from '@cms/shared';

const dtdc = new DtdcBulkAdapter();

export async function processDtdcSingleTrack(job: Job) {
  const { awb } = job.data as {
    awb: string;
    provider: string;
    clientId: number;
  };

  // 1️⃣ Find consignment
  const row = await db
    .select({ id: consignments.id })
    .from(consignments)
    .where(eq(consignments.awb, awb))
    .limit(1);

  if (!row.length) {
    throw new Error(`Consignment not found for ${awb}`);
  }

  const consignmentId = row[0].id;

  // 2️⃣ Call DTDC public single track
  const json = await dtdc.trackPublicSingle(awb);
  if (!json || !Array.isArray(json.statuses)) {
    throw new Error('No timeline yet');
  }

  const statuses = json.statuses;
  if (!statuses.length) {
    throw new Error('Empty timeline');
  }

  // 3️⃣ Normalize events
  const events = statuses.map(s => ({
    consignment_id: consignmentId,
    awb,
    provider: 'DTDC',
    status: s.statusDescription ?? '',
    location: s.actCityName ?? s.actBranchName ?? null,
    remarks: s.remarks ?? null,
    event_time: s.statusTimestamp
      ? new Date(s.statusTimestamp.replace(' ', 'T'))
      : null,
  }));

  // 4️⃣ Overwrite events (Neon-safe)
  await db
    .delete(trackingEvents)
    .where(eq(trackingEvents.consignment_id, consignmentId));

  await db.insert(trackingEvents).values(events);

  // 5️⃣ Update consignment status
  const latest = events[0];
  await db
    .update(consignments)
    .set({
      current_status: latest.status,
      last_status_at: latest.event_time,
    })
    .where(eq(consignments.id, consignmentId));
}