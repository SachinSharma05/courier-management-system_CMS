import { trackingQueue } from '../queues/tracking.queue';

export async function startScheduler() {
  console.log('[CRON] Registering poll job');

  await trackingQueue.add(
    'DTDC_POLL_NO_DATA',
    {},
    {
      repeat: { pattern: '*/10 * * * *' },
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: 'exponential', delay: 30000 },
    }
  );
}
