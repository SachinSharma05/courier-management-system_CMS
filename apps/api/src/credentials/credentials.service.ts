import { Injectable, ForbiddenException } from '@nestjs/common';
import { db } from '../db';
import { clientCredentials } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { decrypt } from '../utils/crypto';

@Injectable()
export class CredentialsService {
  async getCredential(params: {
    clientId: number;
    providerId: number;
    key: string;
  }): Promise<string> {
    const row = await db
      .select()
      .from(clientCredentials)
      .where(
        and(
          eq(clientCredentials.client_id, params.clientId),
          eq(clientCredentials.provider_id, params.providerId),
          eq(clientCredentials.env_key, params.key),
        ),
      )
      .limit(1);

    if (!row.length) {
      throw new ForbiddenException('Credential not configured');
    }

    // 🔓 Decrypt ONLY here
    return decrypt(row[0].encrypted_value);
  }
}