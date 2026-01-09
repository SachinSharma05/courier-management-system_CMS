import { Job } from 'bullmq';
import { db } from '../db';
import { consignments } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { trackingQueue } from '../queues/tracking.queue';

export async function pollDelhiveryNoData(_: Job) {
  const rows = await db
    .select({ awb: consignments.awb })
    .from(consignments)
    .where(
      sql`
        provider = 'DELHIVERY'
        AND (
          current_status = 'NO DATA FOUND'
          OR last_status_at IS NULL
        )
      `,
    )
    .limit(200); // 🔴 SAFE batch

  for (const r of rows) {
    await trackingQueue.add(
      'DELHIVERY_SINGLE_TRACK',
      { awb: r.awb },
      {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: 'exponential', delay: 20000 },
      },
    );
  }

  return { enqueued: rows.length };
}