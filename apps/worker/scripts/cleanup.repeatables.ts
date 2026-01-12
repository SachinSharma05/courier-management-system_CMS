import { trackingQueue } from '../queues/tracking.queue';

async function cleanup() {
  const jobs = await trackingQueue.getRepeatableJobs();

  for (const j of jobs) {
    console.log('Removing repeatable:', j.name, j.pattern);
    await trackingQueue.removeRepeatableByKey(j.key);
  }

  process.exit(0);
}

cleanup();
