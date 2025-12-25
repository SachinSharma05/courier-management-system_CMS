import { db } from '../db';
import { auditLogs } from '../db/schema';

export async function auditWorker(action: string, payload: any) {
  await db.insert(auditLogs).values({
    action,
    entity: 'worker',
    payload,
  });
}