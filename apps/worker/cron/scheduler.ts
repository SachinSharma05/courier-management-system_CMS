import cron from 'node-cron';
import { trackingQueue } from '../queues/tracking.queue';

export function startScheduler() {
  // every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('[CRON] Enqueue tracking jobs');

    await trackingQueue.add(
      'poll-tracking',
      {},
      {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: 'exponential', delay: 30000 },
      }
    );
  });
}