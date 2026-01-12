import { inArray, sql } from 'drizzle-orm';
import { db } from '../db';
import { consignments, trackingEvents } from '../db/schema';
import { logger } from '../utils/logger';

export async function cleanupOldConsignments() {
  // 1. Fetch IDs using Drizzle Query Builder
  // We use sql`` for the complex date logic
  const rows = await db
    .select({ id: consignments.id })
    .from(consignments)
    .where(
      sql`COALESCE(${consignments.booked_at}, ${consignments.created_at}) 
          <= NOW() - INTERVAL '20 days'`
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