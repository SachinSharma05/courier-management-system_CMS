// shared/redis.ts OR api/redis.ts
import IORedis from 'ioredis';

export const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});