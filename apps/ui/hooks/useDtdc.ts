import { api } from "@/lib/api/axios";

export interface DtdcServiceabilityPayload {
  origin_pincode: string;
  destination_pincode: string;
}

export interface DtdcSinglePincodeServiceabilityPayload {
  src: string;
}

export interface DtdcPriceTatPayload {
    pickupPincode: string;
    deliveryPincode: string;
    srcCity: string;
    srcState: string;
    destCity: string;
    destState: string;
    weight: string;
    isQRBooking: boolean;
    length: string;
    breadth: string;
    height: string;
    declaredPrice: string;
}

export interface DtdcCreateShipmentPayload {
  order_id: string;
  awb?: string;
  consignee: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
  };
  shipper: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
  };
  weight: number;
  cod_amount?: number;
}

export interface DtdcBulkShipmentPayload {
  shipments: DtdcCreateShipmentPayload[];
}

export async function getServiceability(payload: DtdcServiceabilityPayload) {
  const res = api.post('/providers/dtdc/serviceability', payload);
  return (await res).data;
}

export async function getCommodities() {
  const res = api.get('/providers/dtdc/commodities');
  return (await res).data;
}

export async function getPriceTat(payload: DtdcPriceTatPayload) {
  const res = api.post('/providers/dtdc/priceTat', payload);
  return (await res).data;
}

export async function getSinglePincodeServiceability(src: string) {
  const res = api.get(`/providers/dtdc/singlepincode/${src}`);
  return (await res).data;
}

export async function getLabel(awb: string) {
  const res = api.get(`/providers/dtdc/label/${awb}`, { responseType: 'blob' });
  return res;
}

export function useDtdc() {

  const createShipment = async (payload: DtdcCreateShipmentPayload) =>
    api.post('/providers/dtdc/shipments', payload);

  const bulkShipment = async (payload: DtdcBulkShipmentPayload) =>
    api.post('/providers/dtdc/shipments/bulk', payload);

  const cancelShipment = async (awb: string) =>
    api.post(`/providers/dtdc/cancel/${awb}`);

  const getNdr = async (awb: string) =>
    api.get(`/providers/dtdc/ndr/${awb}`);

  return {
    createShipment,
    bulkShipment,
    cancelShipment,
    getNdr,
  };
}