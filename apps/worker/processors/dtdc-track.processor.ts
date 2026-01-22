import { trackingQueue } from '../queues/tracking.queue';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { decrypt } from '../utils/crypto';

export async function pollNoDataFoundAwbs() {
  console.log('[POLL] Fetching DTDC consignments needing tracking');

  const result = await db.execute(sql`
    SELECT
      c.awb,
      c.client_id,
      MAX(CASE WHEN cc.env_key = 'api_token' THEN cc.encrypted_value END) AS token,
      MAX(CASE WHEN cc.env_key = 'DTDC_CUSTOMER_CODE' THEN cc.encrypted_value END) AS customer_code,
      c.normalized_status,
      c.last_status_at
    FROM consignments c
    LEFT JOIN client_credentials cc
      ON cc.client_id = c.client_id
     AND cc.provider = 'dtdc'
    WHERE
      c.provider = 'DTDC'
      AND COALESCE(c.normalized_status, 'UNKNOWN') NOT IN (
        'DELIVERED',
        'RTO_DELIVERED',
        'CANCELLED',
        'LOST'
      )
      AND (
        c.last_status_at IS NULL
        OR c.last_status_at < NOW() - INTERVAL '6 hours'
      )
      AND (
        c.tracking_locked_at IS NULL
        OR c.tracking_locked_at < NOW() - INTERVAL '30 minutes'
      )
    GROUP BY c.awb, c.client_id, c.normalized_status, c.last_status_at
    ORDER BY c.last_status_at ASC NULLS FIRST
    LIMIT 500
  `);

  const rows = result.rows as Array<{
    awb: string;
    client_id: number;
    token: string | null;
    customer_code: string | null;
  }>;

  if (!rows.length) {
    console.log('[POLL] Nothing to process');
    return;
  }

  // 🔒 lock rows
  await db.execute(sql`
    UPDATE consignments
    SET tracking_locked_at = NOW()
    WHERE awb IN (${sql.join(rows.map(r => r.awb), sql`,`)})
  `);

  const publicBatch: string[] = [];

  let authSingles = 0;

  for (const r of rows) {
    const hasAuth = r.token && r.customer_code;

    if (hasAuth) {
      // ✅ AUTH = SINGLE AWB ONLY
      await trackingQueue.add(
        'DTDC_AUTH_SINGLE',
        {
          awb: r.awb,
          token: decrypt(r.token!),
          customerCode: decrypt(r.customer_code!),
        },
        {
          removeOnComplete: true,
          attempts: 2,
          backoff: { type: 'exponential', delay: 60_000 },
          delay: Math.floor(Math.random() * 2000),
        }
      );
      authSingles++;
    } else {
      publicBatch.push(r.awb);
    }
  }

  // 🌐 PUBLIC BATCH (summary only)
  for (let i = 0; i < publicBatch.length; i += 25) {
    await trackingQueue.add(
      'DTDC_PUBLIC_BATCH',
      { awbs: publicBatch.slice(i, i + 25) },
      {
        removeOnComplete: true,
        attempts: 2,
        backoff: { type: 'exponential', delay: 30_000 },
      }
    );
  }

  console.log('[POLL] DTDC jobs enqueued', {
    authSingles,
    publicAwbs: publicBatch.length,
  });
}