// apps/worker/constants/provider.ts
export enum ProviderKey {
  DTDC = 'dtdc',
  DELHIVERY = 'delhivery',
  MARUTI = 'maruti',
}

export function isProviderKey(value: string): value is ProviderKey {
  return Object.values(ProviderKey).includes(value as ProviderKey);
}
