import { db } from '../db';
import { providers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ProviderKey } from '../constants/provider';

const providerCache = new Map<ProviderKey, number>();

export async function getProviderId(provider: ProviderKey): Promise<number> {
  // 1️⃣ In-memory cache (very fast)
  const cached = providerCache.get(provider);
  if (cached) return cached;

  // 2️⃣ DB lookup
  const rows = await db
    .select({ id: providers.id })
    .from(providers)
    .where(eq(providers.key, provider))
    .limit(1);

  if (!rows.length) {
    throw new Error(`Provider not found in DB: ${provider}`);
  }

  providerCache.set(provider, rows[0].id);
  return rows[0].id;
}