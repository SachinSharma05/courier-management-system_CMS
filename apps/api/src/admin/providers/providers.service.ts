import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { providers, users } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class ProvidersService {
  async list() {
    const rows = await db
      .select({
        id: providers.id,
        name: providers.name,
      })
      .from(providers)
      .where(
        eq(providers.is_active, true)
      )
      .orderBy(asc(providers.name));

    return rows;
  }
}
