import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class ClientsService {
  async list() {
    const rows = await db
      .select({
        id: users.id,
        name: users.company_name,
      })
      .from(users)
      .where(
        eq(users.role, 'client')
      )
      .orderBy(asc(users.company_name));

    return rows;
  }
}
