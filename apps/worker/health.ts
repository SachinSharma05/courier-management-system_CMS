import { redis } from './queues/tracking.queue';
import { db } from './db';

export async function healthCheck() {
  await redis.ping();
  await db.execute('select 1');
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}