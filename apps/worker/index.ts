import 'dotenv/config';

import { Worker, Queue } from 'bullmq';
import { redis } from './queues/tracking.queue';
import { startScheduler } from './cron/scheduler';
import { logger } from './utils/logger';
import {
  processDtdcAuthBatch,
  processDtdcPublicBatch,
  processDtdcSingleTrack,
} from './processors/dtdc.processor';
import { pollNoDataFoundAwbs } from './processors/dtdc-track.processor';
import { processDelhiverySingleTrack } from './processors/delhivery.processor';
import { pollDelhiveryNoData } from './processors/delhivery.poller';
import { cleanupOldConsignments } from './cleanup/cleanup.processor';

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

async function bootstrap() {
  logger.info('Worker process started');

  /* -------------------- */
  /* Scheduler */
  /* -------------------- */
  await startScheduler(); // ✅ MUST await

  /* -------------------- */
  /* Worker */
  /* -------------------- */
  const worker = new Worker(
    'tracking',
    async job => {
      switch (job.name) {
        case 'DTDC_POLL_NO_DATA':
          return pollNoDataFoundAwbs();

        case 'DTDC_AUTH_BATCH':
          return processDtdcAuthBatch(job);

        case 'DTDC_PUBLIC_BATCH':
          return processDtdcPublicBatch(job);

        case 'DTDC_SINGLE_TRACK':
          return processDtdcSingleTrack(job);

        case 'DELHIVERY_POLL_NO_DATA':
          return pollDelhiveryNoData(job);

        case 'DELHIVERY_SINGLE_TRACK':
          return processDelhiverySingleTrack(job);

        case 'DELETE_OLD_CONSIGNMENTS':
          return cleanupOldConsignments();

        default:
          logger.warn('Unknown job', { meta: { name: job?.name, id: job?.id } });
      }
    },
    {
      connection: redis,
      concurrency: 10,
    },
  );

  /* -------------------- */
  /* Error visibility */
  /* -------------------- */
  worker.on('failed', (job, err) => {
    logger.error('Job failed', {
      meta: { name: job?.name, id: job?.id, err: err.message },
    });
  });
}

bootstrap().catch(err => {
  logger.error('Worker bootstrap failed', { meta: err });
  process.exit(1);
});
