import { db } from '../db';
import { clientLimits } from '../db/schema';
import { sql, eq } from "drizzle-orm";

export async function getClientLimit(clientId: number) {
  const row = await db
    .select()
    .from(clientLimits)
    .where(eq(clientLimits.client_id, clientId))
    .limit(1);

  return row[0]?.max_requests_per_minute ?? 60;
}