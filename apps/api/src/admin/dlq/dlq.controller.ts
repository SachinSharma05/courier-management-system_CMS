import { Controller, Post, Body, Req } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redis } from '../../redis';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditService } from '../../audit/audit.service';
import { Throttle } from '@nestjs/throttler';

@Controller('admin/dlq')
export class DlqController {
  private dlq: Queue;
  private queue: Queue;

  constructor(private readonly audit: AuditService) {
    this.dlq = new Queue('tracking-dlq', { connection: redis });
    this.queue = new Queue('tracking', { connection: redis });
  }

  @Post('retry')
  @Roles('SUPER_ADMIN')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async retry(@Body() body, @Req() req) {
    const job = await this.dlq.getJob(body.jobId);

    if (!job) {
      throw new Error('DLQ job not found');
    }

    await this.queue.add('retry-tracking', job.data);

    await this.audit.log({
      userId: req.user.userId,
      role: req.user.role,
      action: 'DLQ_RETRY',
      entity: 'tracking_job',
      entityId: body.jobId,
      payload: { jobId: body.jobId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    await job.remove();

    return { status: 'requeued' };
  }
}