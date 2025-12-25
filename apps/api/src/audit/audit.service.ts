import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { auditLogs } from '../db/schema';

@Injectable()
export class AuditService {
  async log(params: {
    userId?: number;
    role?: string;
    clientId?: number;
    action: string;
    entity?: string;
    entityId?: string;
    payload?: any;
    ip?: string;
    userAgent?: string;
  }) {
    await db.insert(auditLogs).values({
      user_id: params.userId,
      role: params.role,
      client_id: params.clientId,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId,
      payload: params.payload,
      ip_address: params.ip,
      user_agent: params.userAgent,
    });
  }
}