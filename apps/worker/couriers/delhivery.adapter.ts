import axios from 'axios';
import { CourierAdapter } from './types';
import { ProviderKey } from '../constants/provider';

export const delhiveryAdapter: CourierAdapter = {
  provider: ProviderKey.DELHIVERY,

  async track(clientId: number, awb: string) {

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
console.log('Delhivery single track response', res.data);
    const shipment = res.data.ShipmentData[0].Shipment;

    return {
      status: shipment.Status.Status,
      location: shipment.Status.Location,
      event_time: new Date(shipment.Status.StatusDateTime),
      raw: shipment,
    };
  },
};