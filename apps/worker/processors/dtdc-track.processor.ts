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
      MAX(CASE WHEN cc.env_key = 'DTDC_CUSTOMER_CODE' THEN cc.encrypted_value END) AS customer_code
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
        OR (
          c.normalized_status = 'IN_TRANSIT'
          AND c.last_status_at < NOW() - INTERVAL '7 days'
        )
      )
    GROUP BY c.awb, c.client_id
    ORDER BY MIN(c.last_status_at) ASC NULLS FIRST
    LIMIT 500
  `);

  const rows = result.rows as DtdcPollRow[];

  if (!rows.length) {
    console.log('[POLL] Nothing to process');
    return;
  }

  const authBuckets = new Map<number, {
    awbs: string[];
    token: string;
    customerCode: string;
  }>();

  const publicBatch: string[] = [];
  const publicSingle: string[] = [];

  for (const r of rows) {
    if (r.token && r.customer_code) {
      if (!authBuckets.has(r.client_id)) {
        authBuckets.set(r.client_id, {
          awbs: [],
          token: decrypt(r.token),
          customerCode: decrypt(r.customer_code),
        });
      }
      authBuckets.get(r.client_id)!.awbs.push(r.awb);
    } else {
      // PUBLIC: always batch first
      publicBatch.push(r.awb);

      // 🔥 ALSO enqueue for single (timeline fetch)
      publicSingle.push(r.awb);
    }
  }

  // 🔴 PUBLIC SINGLE (TIMELINE – REQUIRED)
  for (const awb of publicSingle) {
    await trackingQueue.add(
      'DTDC_SINGLE_TRACK',
      { awb },
      { removeOnComplete: true }
    );
  }

  // 🔐 AUTH BATCH (25 AWBs)
  for (const bucket of authBuckets.values()) {
    for (let i = 0; i < bucket.awbs.length; i += 25) {
      await trackingQueue.add('DTDC_AUTH_BATCH', {
        awbs: bucket.awbs.slice(i, i + 25),
        token: bucket.token,
        customerCode: bucket.customerCode,
      });
    }
  }

  // 🌐 PUBLIC BATCH (25 AWBs, status-only)
  for (let i = 0; i < publicBatch.length; i += 25) {
    await trackingQueue.add('DTDC_PUBLIC_BATCH', {
      awbs: publicBatch.slice(i, i + 25),
    });
  }

  console.log('[POLL] DTDC jobs enqueued');
}

type DtdcPollRow = {
  awb: string;
  client_id: number;
  token: string | null;
  customer_code: string | null;
};