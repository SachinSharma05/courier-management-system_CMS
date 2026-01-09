import { db } from '../db';
import { clientCredentials } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { decrypt } from '../utils/crypto';

const CACHE_TTL = 60 * 60; // 1 hour

export class CredentialsService{
  async getCredentials(params: {
    clientId: number;
    provider: string;
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
          eq(clientCredentials.provider, params.provider),
          eq(clientCredentials.env_key, params.key),
          eq(clientCredentials.is_active, true)
        )
      )
      .limit(1);

    if (!rows.length) {
      throw new Error(
        `Missing credentials for client ${params.clientId}, provider ${params.provider}`
      );
    }

    return decrypt(rows[0].encrypted_value);
  }
}

export const credentialsService = new CredentialsService();