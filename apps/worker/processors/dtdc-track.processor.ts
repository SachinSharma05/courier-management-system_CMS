import { trackingQueue } from '../queues/tracking.queue';
import { db } from '../db';
import { consignments } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function pollNoDataFoundAwbs() {
  console.log('[POLL] Fetching NO DATA FOUND consignments');

  const rows = await db
    .select({
      awb: consignments.awb,
      clientId: consignments.client_id,
    })
    .from(consignments)
    .where(eq(consignments.current_status, 'NO DATA FOUND'))
    .limit(50); // 🔴 batch size control

  if (!rows.length) {
    console.log('[POLL] Nothing to process');
    return;
  }

  for (const row of rows) {
    await trackingQueue.add(
      'DTDC_SINGLE_TRACK',
      {
        awb: row.awb,
        clientId: row.clientId,
        provider: 'DTDC',
      },
      {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: 'exponential', delay: 20000 },
      }
    );
  }

  console.log(`[POLL] Enqueued ${rows.length} AWBs`);
}