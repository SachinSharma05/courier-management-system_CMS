import { Controller, Get, UseGuards } from '@nestjs/common';
import { redis } from '../../redis';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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