import { db } from '../db';
import { clientCredentials } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { decrypt } from '../utils/crypto';

const CACHE_TTL = 60 * 60; // 1 hour

export class CredentialsService{
  async getCredentials(params: {
    clientId: number;
    providerId: number;
    key: string;
  }): Promise<string>    
  {
    // 2️⃣ Fetch from DB
    const rows = await db
      .select()
      .from(clientCredentials)
      .where(
        and(
          eq(clientCredentials.client_id, params.clientId),
          eq(clientCredentials.provider_id, params.providerId),
          eq(clientCredentials.env_key, params.key),
          eq(clientCredentials.is_active, true)
        )
      )
      .limit(1);

    if (!rows.length) {
      throw new Error(
        `Missing credentials for client ${params.clientId}, provider ${params.providerId}`
      );
    }

    return decrypt(rows[0].encrypted_value);
  }
}