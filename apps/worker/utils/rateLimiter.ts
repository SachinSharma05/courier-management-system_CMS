import { redis } from '../queues/tracking.queue';

export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
) {
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowSec);
  }

  if (count > limit) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }
}