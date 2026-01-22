import 'dotenv/config';

import { Worker, Queue } from 'bullmq';
import { redis } from './queues/tracking.queue';
import { logger } from './utils/logger';
import {
  processDtdcAuthSingle,
  processDtdcPublicBatch,
  processDtdcSingleTrack,
} from './processors/dtdc.processor';
import { pollNoDataFoundAwbs } from './processors/dtdc-track.processor';
import { processDelhiverySingleTrack } from './processors/delhivery.processor';
import { pollDelhiveryNoData } from './processors/delhivery.poller';
import { cleanupOldConsignments } from './cleanup/cleanup.processor';
import { startScheduler } from './cron/scheduler';

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
  logger.info('Worker processes initializing...');

  await startScheduler();

  /* ---------------------------------------------------------
     WORKER 1: BATCH & POLL (Medium Concurrency)
     Handles the "Management" jobs and Bulk API calls
  --------------------------------------------------------- */
  const batchWorker = new Worker(
    'tracking',
    async job => {
      switch (job.name) {
        case 'DTDC_POLL_NO_DATA':        return pollNoDataFoundAwbs();
        case 'DELHIVERY_POLL_NO_DATA':   return pollDelhiveryNoData(job);
        case 'DTDC_AUTH_SINGLE':          return processDtdcAuthSingle(job);
        case 'DTDC_PUBLIC_BATCH':        return processDtdcPublicBatch(job);
        case 'DELETE_OLD_CONSIGNMENTS':  return cleanupOldConsignments();
        default:
          return; // 🔴 REQUIRED
      }
    },
    { 
      connection: redis, 
      concurrency: 5, 
      name: 'batch-worker',
      autorun: true 
    }
  );

  /* ---------------------------------------------------------
     WORKER 2: SCRAPERS / SINGLE TRACK (Low Concurrency)
     Strictly for Single AWB tracking to prevent IP bans.
  --------------------------------------------------------- */
  const singleTrackWorker = new Worker(
    'tracking',
    async job => {
      switch (job.name) {
        case 'DTDC_SINGLE_TRACK':      return processDtdcSingleTrack(job);
        case 'DELHIVERY_SINGLE_TRACK': return processDelhiverySingleTrack(job);
        default:
          return; // 🔴 REQUIRED
      }
    },
    {
      connection: redis,
      concurrency: 2,
      name: 'single-track-worker',
      limiter: { max: 10, duration: 1000 },
      autorun: true
    }
  );

  // Error handling for both
  const workers = [batchWorker, singleTrackWorker];
  workers.forEach(w => {
    w.on('ready', () => {
      logger.info(`Worker ready: ${w.name}`);
    });
    w.on('failed', async (job, err) => {
      logger.error(`Job [${job?.name}] failed`, {
        meta: { id: job?.id, err: err.message },
      });

      if (job) {
        await deadLetterQueue.add('FAILED_JOB', {
          name: job.name,
          data: job.data,
          error: err.message,
        });
      }
    });
  });
}

bootstrap().catch(err => {
  logger.error('Worker bootstrap failed', { meta: err });
  process.exit(1);
});
