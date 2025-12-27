import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index'; // your drizzle db instance
import { users } from '../../db/schema';

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
}