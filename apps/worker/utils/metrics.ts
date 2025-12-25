import { redis } from '../queues/tracking.queue';

export async function incrMetric(
  name: string,
  labels: Record<string, string>
) {
  const key =
    'metric:' +
    name +
    ':' +
    Object.entries(labels)
      .map(([k, v]) => `${k}=${v}`)
      .join(',');

  await redis.incr(key);
  await redis.expire(key, 86400); // 24h
}

export async function observeLatency(
  name: string,
  ms: number,
  labels: Record<string, string>
) {
  const key =
    'metric:' +
    name +
    ':latency:' +
    Object.entries(labels)
      .map(([k, v]) => `${k}=${v}`)
      .join(',');

  await redis.lpush(key, ms);
  await redis.ltrim(key, 0, 999);
  await redis.expire(key, 86400);
}