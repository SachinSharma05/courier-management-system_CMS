import axios, { AxiosInstance } from 'axios';
import { DTDC_BASE_URL, DTDC_ENDPOINTS } from './dtdc.constants';

export class DtdcClient {
  private publicHttp: AxiosInstance;
  private ebookingHttp: AxiosInstance;

  constructor() {
    this.publicHttp = axios.create({
      baseURL: DTDC_BASE_URL.PUBLIC,
      timeout: 15_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.ebookingHttp = axios.create({
      baseURL: DTDC_BASE_URL.EBOOKING,
      timeout: 15_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ✅ PUBLIC SERVICEABILITY
  async checkServiceability(
    originPincode: string,
    destinationPincode: string,
  ) {
    const res = await this.publicHttp.post(
      DTDC_ENDPOINTS.SERVICEABILITY,
      {
        orgPincode: originPincode,
        desPincode: destinationPincode,
      },
    );

    return res.data;
  }

  // ✅ PRICE & TAT
  async checkPriceTat(payload: {
    pickupPincode: string;
    deliveryPincode: string;
    srcCity: string;
    srcState: string;
    destCity: string;
    destState: string;
    weight: string;
    courierType: string;
    isQRBooking: boolean;
  }) {
    const res = await this.ebookingHttp.post(
      DTDC_ENDPOINTS.PRICE_TAT,
      payload,
    );

    return res.data;
  }

  // ✅ SINGLE PINCODE SERVICEABILITY
  async checkSinglePincodeServiceability(
    srcPincode: string,
    options?: {
      fetchServiceability?: boolean;
      fetchWeight?: boolean;
      isQRBooking?: boolean;
    },
  ) {
    const res = await this.ebookingHttp.get(
      DTDC_ENDPOINTS.SINGLE_PINCODE_SERVICE,
      {
        params: {
          src: srcPincode,
          fetchServiceability: options?.fetchServiceability ?? true,
          fetchWeight: options?.fetchWeight ?? false,
          isQRBooking: options?.isQRBooking ?? false,
        },
      },
    );

    return res.data;
  }
}
