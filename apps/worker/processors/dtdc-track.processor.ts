import { trackingQueue } from '../queues/tracking.queue';
import { db } from '../db';
import { consignments } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export async function pollNoDataFoundAwbs() {
  console.log('[POLL] Fetching DTDC consignments needing tracking');

  const rows = await db.execute(sql`
    SELECT c.awb, c.client_id
    FROM consignments c
    LEFT JOIN tracking_events e
      ON e.consignment_id = c.id
    WHERE
      c.provider = 'DTDC'
      AND (
        -- 1️⃣ No events at all (BOOTSTRAP CASE)
        e.id IS NULL

        OR

        -- 2️⃣ Non-terminal but stale
        (
          c.last_status_at < NOW() - INTERVAL '6 hours'
          AND NOT (
            LOWER(c.current_status) LIKE '%deliver%'
            OR LOWER(c.current_status) LIKE '%cancel%'
            OR LOWER(c.current_status) LIKE '%lost%'
            OR LOWER(c.current_status) LIKE '%damage%'
            OR LOWER(c.current_status) LIKE '%rto delivered%'
          )
        )
      )
    LIMIT 50;
  `);

  if (!rows.rows.length) {
    console.log('[POLL] Nothing to process');
    return;
  }

  for (const r of rows.rows) {
    await trackingQueue.add(
      'DTDC_SINGLE_TRACK',
      {
        awb: r.awb,
        clientId: r.client_id,
        provider: 'DTDC',
      },
      {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: 'exponential', delay: 20000 },
      }
    );
  }

  console.log(`[POLL] Enqueued ${rows.rows.length} DTDC AWBs`);
}