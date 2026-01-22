import { trackingQueue } from '../queues/tracking.queue';

export async function startScheduler() {
  console.log('[CRON] Registering poll jobs');

  const existingJobs = await trackingQueue.getRepeatableJobs();
  for (const job of existingJobs) {
    if (
      job.name === 'DTDC_POLL_NO_DATA' 
      || job.name === 'DELHIVERY_POLL_NO_DATA' 
      || job.name === 'DELETE_OLD_CONSIGNMENTS'
      ) 
    {
      await trackingQueue.removeRepeatableByKey(job.key);
    }
  }

  // DTDC Cron (every 10 mins)
  await trackingQueue.add(
    'DTDC_POLL_NO_DATA',
    {},
    {
      jobId: 'DTDC_POLL_NO_DATA_CRON',
      repeat: { every: 10 * 60 * 1000 },
      attempts: 3,
      backoff: { type: 'exponential', delay: 30000 },
      removeOnFail: false,
    }
  );

  // Delhivery Cron (every 10 mins)
  await trackingQueue.add(
    'DELHIVERY_POLL_NO_DATA',
    {},
    {
      jobId: 'DELHIVERY_POLL_CRON',
      repeat: { pattern: '*/10 * * * *' },
      attempts: 3,
      backoff: { type: 'exponential', delay: 30000 },
      removeOnFail: false,
    }
  );

  // Daily cleanup (3 AM)
  await trackingQueue.add(
    'DELETE_OLD_CONSIGNMENTS',
    {},
    {
      jobId: 'DELETE_OLD_CONSIGNMENTS_CRON',
      repeat: { pattern: '0 3 * * *' },
      attempts: 3,
      backoff: { type: 'exponential', delay: 60000 },
      removeOnFail: false,
    }
  );

  console.log('[CRON] Scheduler ready');
}