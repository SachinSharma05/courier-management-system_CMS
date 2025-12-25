import axios from 'axios';
import { CourierAdapter } from './types';
import { ProviderKey } from '../constants/provider';
import { CredentialsService } from '../services/credentials.service';

const creds = new CredentialsService();

export const delhiveryAdapter: CourierAdapter = {
  provider: ProviderKey.DELHIVERY,

  async track(clientId: number, awb: string) {
    // 🔐 Fetch & decrypt ONLY here
    const apiKey = await creds.getCredentials({
      clientId,
      providerId: 1, // DTDC
      key: 'api_key',
    });

    const res = await axios.get(
      'https://track.delhivery.com/api/v1/packages/json/',
      {
        params: { waybill: awb },
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_KEY}`,
        },
        timeout: 10_000,
      }
    );

    const shipment = res.data.ShipmentData[0].Shipment;

    return {
      status: shipment.Status.Status,
      location: shipment.Status.Location,
      event_time: new Date(shipment.Status.StatusDateTime),
      raw: shipment,
    };
  },
};