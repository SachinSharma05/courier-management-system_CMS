import axios, { AxiosInstance } from 'axios';
import { DTDC_BASE_URL, DTDC_ENDPOINTS } from './dtdc.constants';

export class DtdcClient {
  private publicHttp: AxiosInstance;
  private ebookingHttp: AxiosInstance;
  private shipsyHttp: AxiosInstance;

  constructor(apiKey?: string) {
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

    if (apiKey) {
      this.shipsyHttp = axios.create({
        baseURL: DTDC_BASE_URL.SHIPSY,
        timeout: 20_000,
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        responseType: 'arraybuffer', // 🔥 IMPORTANT
      });
    }
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

  // 🔹 PRINT LABEL
  async printLabel(referenceNumber: string) {
    if (!this.shipsyHttp) {
      throw new Error('DTDC Shipsy API key not configured');
    }

    const res = await this.shipsyHttp.post(
      DTDC_ENDPOINTS.PRINT_LABEL,
      {
        reference_number: referenceNumber,
      },
    );

    return res.data; // binary buffer
  }
}
