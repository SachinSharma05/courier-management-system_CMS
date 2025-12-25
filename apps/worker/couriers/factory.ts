import { ProviderKey } from '../constants/provider';
import { CourierAdapter } from './types';
import { dtdcAdapter } from './dtdc.adapter';
import { delhiveryAdapter } from './delhivery.adapter';
import { marutiAdapter } from './maruti.adapter';

const adapters: Record<ProviderKey, CourierAdapter> = {
  [ProviderKey.DTDC]: dtdcAdapter,
  [ProviderKey.DELHIVERY]: delhiveryAdapter,
  [ProviderKey.MARUTI]: marutiAdapter,
};

export function getCourierAdapter(provider: ProviderKey): CourierAdapter {
  const adapter = adapters[provider];
  if (!adapter) {
    throw new Error(`No courier adapter for provider: ${provider}`);
  }
  return adapter;
}