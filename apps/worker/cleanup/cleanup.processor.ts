import { inArray, sql, and, eq } from 'drizzle-orm';
import { db } from '../db';
import { consignments, trackingEvents } from '../db/schema';
import { logger } from '../utils/logger';

export async function cleanupOldConsignments() {
  const rows = await db
    .select({ id: consignments.id })
    .from(consignments)
    .where(
      and(
        eq(consignments.normalized_status, 'delivered'),
        sql`(
          (${consignments.booked_at} IS NOT NULL 
            AND ${consignments.booked_at} <= NOW() - INTERVAL '10 days')
          OR
          (${consignments.booked_at} IS NULL 
            AND ${consignments.created_at} <= NOW() - INTERVAL '10 days')
        )`
      )
    )
    .limit(500);

  if (rows.length === 0) {
    logger.info('Cleanup: no consignments found');
    return { deleted: 0 };
  }

  const ids = rows.map((r) => r.id);

  // 2. Perform deletions
  // Since Neon HTTP doesn't support traditional transactions via .transaction(),
  // we execute them sequentially. Ensure you delete events first (foreign key).
  
  await db
    .delete(trackingEvents)
    .where(inArray(trackingEvents.consignment_id, ids));

  await db
    .delete(consignments)
    .where(inArray(consignments.id, ids));

  logger.info('Cleanup: consignments deleted', {
    meta: { ids }
  });

  return { deleted: ids.length };
}