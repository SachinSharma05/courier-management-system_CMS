import { Worker, Queue, Job } from 'bullmq';
import { redis } from './queues/tracking.queue';
import { startScheduler } from './cron/scheduler';
import { pollCourier } from './services/pollCourier';
import { db } from './db';
import { consignments, trackingEvents } from './db/schema';
import { eq, ne } from 'drizzle-orm';
import { isProviderKey } from './constants/provider';
import { logger } from './utils/logger';
import { startHeartbeat } from './heartbeat';

/* -------------------- */
/* Global startup logs */
/* -------------------- */
logger.info('Worker process started');

/* -------------------- */
/* Dead Letter Queue */
/* -------------------- */
const deadLetterQueue = new Queue('tracking-dlq', {
  connection: redis,
});

/* -------------------- */
/* Graceful shutdown */
/* -------------------- */
async function shutdown(signal: string) {
  logger.info('Shutting down worker', { meta: { signal } });
  await redis.quit();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

/* -------------------- */
/* Worker */
/* -------------------- */
new Worker(
  'tracking',
  async (_job: Job) => {
    logger.info('Polling consignments');

    startHeartbeat();

    const rows = await db
      .select()
      .from(consignments)
      .where(ne(consignments.current_status, 'Delivered'));

    for (const c of rows) {
      if (!isProviderKey(c.provider)) {
        logger.warn('Unknown provider, skipping', {
          provider: c.provider,
          awb: c.awb,
        });
        continue;
      }

      try {
        const event = await pollCourier(
          c.client_id,
          c.provider,
          c.awb
        );

        // ✅ Insert tracking event (idempotent)
        await db
          .insert(trackingEvents)
          .values({
            consignment_id: c.id,
            provider: c.provider,
            awb: c.awb,
            status: event.status,
            location: event.location ?? null,
            event_time: event.event_time,
            raw: event.raw,
          })
          .onConflictDoNothing();

        // ✅ Update consignment
        await db
          .update(consignments)
          .set({
            current_status: event.status,
            last_status_at: event.event_time,
            updated_at: new Date(),
          })
          .where(eq(consignments.id, c.id));

      } catch (error) {
        logger.error('Tracking failed', {
          provider: c.provider,
          clientId: c.client_id,
          awb: c.awb,
          error,
        });

        await deadLetterQueue.add('failed-tracking', {
          clientId: c.client_id,
          provider: c.provider,
          awb: c.awb,
          reason: String(error),
        });
      }
    }
  },
  { connection: redis }
);

/* -------------------- */
/* Scheduler */
/* -------------------- */
startScheduler();