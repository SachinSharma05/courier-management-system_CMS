import { redis } from '../queues/tracking.queue';

const MAX_FAILURES = 5;
const BLOCK_TIME = 60; // seconds

export async function checkCircuit(provider: string) {
  const key = `cb:${provider}`;
  const failures = Number(await redis.get(key) || 0);

  if (failures >= MAX_FAILURES) {
    throw new Error('CIRCUIT_OPEN');
  }
}

export async function recordFailure(provider: string) {
  const key = `cb:${provider}`;
  await redis.incr(key);
  await redis.expire(key, BLOCK_TIME);
}

export async function recordSuccess(provider: string) {
  const key = `cb:${provider}`;
  await redis.del(key);
}