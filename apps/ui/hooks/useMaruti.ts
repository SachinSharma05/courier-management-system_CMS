import { api } from '@/lib/api/axios';

export function useMaruti() {
  /* ========= SELLER ========= */

  const checkEcommServiceability = (
    payload: MarutiEcommServiceabilityRequest,
  ) =>
    api.post('/admin/maruti/serviceability/ecomm', payload);

  const checkHyperlocalServiceability = (
    payload: MarutiHyperlocalServiceabilityRequest,
  ) =>
    api.post('/admin/maruti/serviceability/hyperlocal', payload);

  const calculateEcommRate = (
    payload: MarutiEcommRateRequest,
  ) =>
    api.post('/admin/maruti/rate/ecomm', payload);

  const trackOrder = (awb: string) =>
    api.get(`/admin/maruti/tracking/${awb}`);

  const createEcommOrder = (
    payload: MarutiBookingRequest,
  ) =>
    api.post('/admin/maruti/orders/ecomm', payload);

  const createHyperlocalOrder = (
    payload: MarutiBookingRequest,
  ) =>
    api.post('/admin/maruti/orders/hyperlocal', payload);

  const createManifest = (payload: AwbOptional) =>
    api.post('/admin/maruti/manifest', payload);

  const cancelOrder = (
    payload: MarutiCancelOrderRequest,
  ) =>
    api.put('/admin/maruti/cancel', payload);

  const getLabelInvoice = (params: AwbOptional) =>
    api.get('/admin/maruti/label-invoice', { params });

  /* ========= OPS – DRS ========= */

  const validateDrsAwbs = (
    payload: MarutiValidateDrsAwbsRequest,
  ) =>
    api.post('/admin/maruti/ops/drs/validate-awbs', payload);

  const createDrs = (
    payload: MarutiCreateDrsRequest,
  ) =>
    api.post('/admin/maruti/ops/drs/create', payload);

  const getDrsShipmentList = (daId: string) =>
    api.get('/admin/maruti/ops/drs/list', {
      params: { daId },
    });

  const updateDrsStatus = (
    payload: MarutiUpdateDrsStatusRequest,
  ) =>
    api.post('/admin/maruti/ops/drs/update-status', payload);

  /* ========= OPS – PRS ========= */

  const createPrs = (
    payload: MarutiPrsCreateRequest,
  ) =>
    api.post('/admin/maruti/ops/prs/create', payload);

  const updatePrsScanned = (
    payload: MarutiPrsUpdateScannedRequest,
  ) =>
    api.patch('/admin/maruti/ops/prs/update-scanned', payload);

  const updatePrsStatus = (
    payload: MarutiPrsUpdateStatusRequest,
  ) =>
    api.patch('/admin/maruti/ops/prs/update-status', payload);

  const getPrsOrders = (prsNumber: string) =>
    api.get(`/admin/maruti/ops/prs/${prsNumber}/orders`);

  return {
    // Seller
    checkEcommServiceability,
    checkHyperlocalServiceability,
    calculateEcommRate,
    trackOrder,
    createEcommOrder,
    createHyperlocalOrder,
    createManifest,
    cancelOrder,
    getLabelInvoice,

    // DRS
    validateDrsAwbs,
    createDrs,
    getDrsShipmentList,
    updateDrsStatus,

    // PRS
    createPrs,
    updatePrsScanned,
    updatePrsStatus,
    getPrsOrders,
  };
}


export type AwbOptional = {
  awbNumber?: string;
  cAwbNumber?: string;
};

export interface MarutiEcommServiceabilityRequest {
  fromPincode: string;
  toPincode: string;
  isCodOrder: boolean;
  deliveryMode: string;
}

export interface MarutiAddress {
  name: string;
  phone: string;
  email?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  latitude: number;
  longitude: number;
}

export interface MarutiHyperlocalServiceabilityRequest {
  pickupAddress: MarutiAddress;
  shippingAddress: MarutiAddress;
}

export interface MarutiEcommRateRequest {
  deliveryPromise: string;
  fromPincode: number;
  toPincode: number;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  volumetricWeight?: number;
}

export interface MarutiLineItem {
  name: string;
  sku: string;
  quantity: number;
  weight: number;
  unitPrice: number;
  price: number;
}

export interface MarutiBookingRequest {
  orderId: string;
  orderCreatedAt: string;
  currency: 'INR';
  amount: number;
  weight: number;
  paymentType: 'COD' | 'PREPAID';
  paymentStatus: 'PENDING' | 'PAID';
  remarks?: string;
  lineItems: MarutiLineItem[];
  shippingAddress: MarutiAddress;
  billingAddress?: MarutiAddress;
  pickupAddress: MarutiAddress;
  returnAddress?: MarutiAddress;
  deliveryPromise: string;
  length?: number;
  width?: number;
  height?: number;
}

export interface MarutiCancelOrderRequest {
  orderId: string;
  cancelReason: string;
}

export interface MarutiValidateDrsAwbsRequest {
  awbList: string[];
  daId: string;
  daMobileNo?: string;
  deliveryArea?: string;
  deliveryPincode?: number;
  type?: 'NORMAL' | 'ECOM' | 'HYPERLOCAL';
}

export interface MarutiCreateDrsRequest {
  awbList: string[];
  daId: string;
  daMobileNo?: string;
  deliveryArea?: string;
  deliveryPincode?: number;
  type?: 'ECOM' | 'HYPERLOCAL';
}

export interface MarutiUpdateDrsStatusRequest {
  cAWB_No: string;
  is_delivered: boolean;
  location: string;
  status_timestamp: string;
  pod?: {
    receiver_name?: string;
    receiver_phone?: string;
    delivery_remarks?: string;
    image?: string[];
  };
}

export interface MarutiPrsGeoLocation {
  cordinates: number[];
}

export interface MarutiPrsAddress {
  name: string;
  mobile: string;
  address1: string;
  address2?: string;
  zip: string;
  state: string;
  city: string;
  geoLocation: MarutiPrsGeoLocation;
}

export interface MarutiPrsCreateRequest {
  awbNumberList: string[];
  sellerInfo: {
    name: string;
    mobile: string;
    companyName: string;
  };
  pickupInfo: MarutiPrsAddress;
  dropInfo: MarutiPrsAddress;
  source: string;
}

export interface MarutiPrsUpdateScannedRequest {
  deliveryAgentId: string;
  prsNumber: string;
  awbNumberList: string[];
}

export interface MarutiPrsUpdateStatusRequest {
  prsNumber: string;
  status: string;
}

