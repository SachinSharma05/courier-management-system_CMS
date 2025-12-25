import { db } from '../db';
import { providers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ProviderKey } from '../constants/provider';

export async function assertProviderEnabled(
  provider: ProviderKey
) {
  const rows = await db
    .select({ isActive: providers.is_active })
    .from(providers)
    .where(eq(providers.key, provider))
    .limit(1);

  if (!rows.length || !rows[0].isActive) {
    throw new Error(`PROVIDER_DISABLED:${provider}`);
  }
}