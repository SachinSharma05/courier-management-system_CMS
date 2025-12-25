import {
  Controller,
  Post,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { db } from '../../db';
import { clientLimits } from '../../db/schema';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditService } from '../../audit/audit.service';
import { Throttle } from '@nestjs/throttler';

@Controller('admin/clients')
export class ClientLimitsController {
  constructor(private readonly audit: AuditService) {}

  @Post(':clientId/limits')
  @Roles('SUPER_ADMIN')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async setLimit(
    @Param('clientId') clientId: string,
    @Body() body: { rpm: number },
    @Req() req: FastifyRequest & { user: any },
  ) {
    await db
      .insert(clientLimits)
      .values({
        client_id: Number(clientId),
        max_requests_per_minute: body.rpm,
      })
      .onConflictDoUpdate({
        target: clientLimits.client_id,
        set: { max_requests_per_minute: body.rpm },
      });

    await this.audit.log({
      userId: req.user.userId,
      role: req.user.role,
      clientId: Number(clientId),
      action: 'CLIENT_LIMIT_UPDATE',
      entity: 'client',
      entityId: clientId,
      payload: { rpm: body.rpm },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { status: 'updated' };
  }
}