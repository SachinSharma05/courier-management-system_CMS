import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

export const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const trackingQueue = new Queue('tracking', {
  connection: redis,
});