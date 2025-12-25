import { Controller, Get } from '@nestjs/common';
import { redis } from '../../redis';

@Controller('admin/worker')
export class WorkerController {
  @Get('status')
  async status() {
    const ts = await redis.get('worker:tracking:heartbeat');

    return {
      alive: Boolean(ts),
      lastSeen: ts ? new Date(Number(ts)) : null,
    };
  }
}