import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { clientCredentials } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { decrypt, encrypt } from '../utils/crypto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsService {
  async getCredentials(clientId: number, provider: string) {
    const rows = await db
      .select({
        id: clientCredentials.id,
        key: clientCredentials.env_key,
        provider: clientCredentials.provider,
        createdAt: clientCredentials.created_at,
      })
      .from(clientCredentials)
      .where(
        and(
          eq(clientCredentials.client_id, clientId),
          eq(clientCredentials.provider, provider),
        ),
      );

    // ⚠️ Do NOT return decrypted values
    return rows;
  }

  async createCredential(dto: CreateCredentialDto) {
    const encrypted = encrypt(dto.value);

    const [row] = await db
      .insert(clientCredentials)
      .values({
        client_id: dto.clientId,
        provider: dto.provider,
        env_key: dto.key,
        encrypted_value: encrypted,
      })
      .returning();

    return row;
  }

  async updateCredential(dto: UpdateCredentialDto) {
    const encrypted = encrypt(dto.value);

    const [updated] = await db
      .update(clientCredentials)
      .set({
        encrypted_value: encrypted,
      })
      .where(eq(clientCredentials.id, dto.id))
      .returning();

    if (!updated) {
      throw new NotFoundException('Credential not found');
    }

    return updated;
  }
}