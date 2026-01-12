import 'dotenv/config';

import { Worker, Queue, Job } from 'bullmq';
import { redis } from './queues/tracking.queue';
import { startScheduler } from './cron/scheduler';
import { logger } from './utils/logger';
import { processDtdcSingleTrack } from './processors/dtdc.processor';
import { pollNoDataFoundAwbs } from './processors/dtdc-track.processor';
import { processDelhiverySingleTrack } from './processors/delhivery.processor';
import { pollDelhiveryNoData } from './processors/delhivery.poller';
import { cleanupOldConsignments } from './cleanup/cleanup.processor';

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
  async job => {
    switch (job.name) {
      case 'DTDC_POLL_NO_DATA':
        return pollNoDataFoundAwbs();

      case 'DTDC_SINGLE_TRACK':
        return processDtdcSingleTrack(job);

      case 'DELHIVERY_POLL_NO_DATA':
        return pollDelhiveryNoData(job);

      case 'DELHIVERY_SINGLE_TRACK':
        return processDelhiverySingleTrack(job);

      case 'DELETE_OLD_CONSIGNMENTS':
        return cleanupOldConsignments(); // fast + idempotent

      default:
        console.log('Unknown job', { meta: job.name });
        return;
    }
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

/* -------------------- */
/* Scheduler */
/* -------------------- */
startScheduler();