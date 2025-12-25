import { redis } from './queues/tracking.queue';

export function startHeartbeat() {
  setInterval(async () => {
    await redis.set(
      'worker:tracking:heartbeat',
      Date.now().toString(),
      'EX',
      30
    );
  }, 10_000);
}