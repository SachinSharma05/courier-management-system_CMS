import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

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
    origin: (origin, cb) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://courier-management-system-cms-ui.vercel.app', // 👈 your UI domain
      ];

      // allow server-to-server or curl requests (no origin)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port =
    process.env.PORT            // Render / prod
      ? Number(process.env.PORT)
      : 4000;                   // Local default

  await app.listen(port, '0.0.0.0');
  
}

bootstrap();