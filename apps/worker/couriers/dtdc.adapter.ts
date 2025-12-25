import axios from 'axios';
import { CourierAdapter } from './types';
import { ProviderKey } from '../constants/provider';
import { CredentialsService } from '../services/credentials.service';

const creds = new CredentialsService();

export const dtdcAdapter: CourierAdapter = {
  provider: ProviderKey.DTDC,

  async track(clientId: number, awb: string) {
    // 🔐 Fetch & decrypt ONLY here
    const apiKey = await creds.getCredentials({
      clientId,
      providerId: 1, // DTDC
      key: 'api_key',
    });

    const res = await axios.get(
      'https://api.dtdc.com/track',
      {
        params: { awb },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10_000,
      }
    );

    const data = res.data;

    return {
      status: data.current_status,
      location: data.current_location,
      event_time: new Date(data.last_update),
      raw: data,
    };
  },
};