import { Job } from 'bullmq';
import { db } from '../db';
import { consignments } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { trackingQueue } from '../queues/tracking.queue';

export async function pollDelhivery(_: Job) {
  const rows = await db
    .select({ awb: consignments.awb })
    .from(consignments)
    .where(sql`
      provider = 'DELHIVERY'
      AND (
        last_status_at IS NULL
        OR last_status_at < NOW() - INTERVAL '6 hours'
      )
      AND tracking_locked_at IS NULL
    `)
    .limit(250);

  // batch into 25
  const batches = [];
  for (let i = 0; i < rows.length; i += 25) {
    batches.push(rows.slice(i, i + 25));
  }

  for (const batch of batches) {
    await trackingQueue.add(
      'DELHIVERY_BULK_TRACK',
      { awbs: batch.map(b => b.awb) },
      {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: 'exponential', delay: 20000 },
      }
    );
  }

  return { enqueued: rows.length, batches: batches.length };
}