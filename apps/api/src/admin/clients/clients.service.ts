import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { encrypt } from '../../utils/crypto';

@Injectable()
export class ClientsService {
  async list() {
    const rows = await db
      .select({
      id: users.id,
      company_name: users.company_name,
      email: users.email,
      phone: users.phone,
      contact_person: users.contact_person,
      is_active: users.is_active,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.role, 'client'))
    .orderBy(users.company_name);

    return rows;
  }

  async createClient(dto: CreateClientDto) {
    const passwordHash = await encrypt(dto.password);
    
    const [client] = await db
      .insert(users)
      .values({
        username: dto.username,            // REQUIRED
        email: dto.email,
        password_hash: passwordHash,   // REQUIRED
        role: 'client',
        company_name: dto.companyName ?? null,
        company_address: dto.companyAddress ?? null,
        contact_person: dto.contactPerson ?? null,
        phone: dto.phone ?? null,
        providers: dto.providers ?? [],
        is_active: true,
      })
      .returning();

    return client;
  }

  async updateClient(id: number, dto: UpdateClientDto) {
    const [updated] = await db
      .update(users)
      .set({
        company_name: dto.companyName,
        company_address: dto.companyAddress,
        contact_person: dto.contactPerson,
        phone: dto.phone,
        providers: dto.providers,
        is_active: dto.isActive,
      })
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException('Client not found');
    }

    return updated;
  }
}
