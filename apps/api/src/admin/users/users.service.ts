import { Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../../db/index'; // your drizzle db instance
import { users } from '../../db/schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { encrypt } from '../../utils/crypto';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        password_hash: users.password_hash, // 🔴 MUST be here
        role: users.role,
        is_active: users.is_active,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] ?? null;
  }

  // GET /admin/users
  // Updated findAll in your service/controller
  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Fetch data
    const data = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        company_name: users.company_name,
        is_active: users.is_active,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(desc(users.created_at))
      .limit(limit)
      .offset(offset);

    // Fetch total count for pagination UI
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(users);

    return {
      data,
      meta: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit)
      }
    };
  }

  // POST /admin/users
  async create(dto: CreateUserDto) {
    const password_hash = await encrypt(dto.password);

    const [user] = await db
      .insert(users)
      .values({
        username: dto.username,
        email: dto.email,
        password_hash,
        role: dto.role ?? "client",
        company_name: dto.company_name,
        company_address: dto.company_address,
        contact_person: dto.contact_person,
        phone: dto.phone,
        providers: dto.providers ?? [],
      })
      .returning();

    return user;
  }

  // PATCH /admin/users/:id
  async update(id: number, dto: UpdateUserDto) {
    const [user] = await db
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  // DELETE /admin/users/:id (soft delete)
  async disable(id: number) {
    await db
      .update(users)
      .set({ is_active: false })
      .where(eq(users.id, id));

    return { success: true };
  }
}