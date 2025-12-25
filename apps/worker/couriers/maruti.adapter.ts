import { CourierAdapter } from './types';
import { ProviderKey } from '../constants/provider';

export const marutiAdapter: CourierAdapter = {
  provider: ProviderKey.MARUTI,

  async track(awb: string) {
    // Replace with real API later
    return {
      status: 'In Transit',
      location: 'Hub',
      event_time: new Date(),
      raw: { awb },
    };
  },
};