import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import Redis from 'ioredis';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    logger: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  // 🔒 Register plugins ONLY ONCE
  if (!(adapter as any)._pluginsRegistered) {
    await app.register(helmet);
    await app.register(cookie);
    (adapter as any)._pluginsRegistered = true;
  }

  await app.register(fastifyCors, {
    origin: 'http://localhost:3000', // Next.js
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(4000, '0.0.0.0');
  
}

async function testRedis() {
    const client = new Redis(
      'rediss://default:ATLEAAIncDJlMzgxNjEwNjVmZDE0Y2YxYWU5YzI5NWEzNjExMmQ2OHAyMTI5OTY@prime-heron-12996.upstash.io:6379',
      {
        tls: {},              // 👈 IMPORTANT for Upstash
        connectTimeout: 10_000,
      }
    );

    await client.set('render-test', 'ok');
    const val = await client.get('render-test');
    console.log('[REDIS TEST]', val);

    await client.quit();
  }

testRedis().catch(console.error);

bootstrap();