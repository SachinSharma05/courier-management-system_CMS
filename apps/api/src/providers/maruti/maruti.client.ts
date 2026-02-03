import axios, { AxiosInstance } from 'axios';
import {
  MARUTI_BASE_URL,
  MARUTI_ENDPOINTS,
} from './maruti.constants';

import { MarutiEcommRateDto } from './dto/maruti-rate.dto';
import { MarutiEcommBookingDto } from './dto/maruti-ecomm-booking.dto';
import { MarutiHyperlocalBookingDto } from './dto/maruti-hyperlocal-booking.dto';
import { MarutiDrsUpdateDto } from './dto/ops/drs/maruti-drs-update.dto';
import { MarutiCreateDrsDto } from './dto/ops/drs/maruti-create-drs.dto';
import { MarutiValidateAwbDto } from './dto/ops/drs/maruti-validate-awb.dto';
import { MarutiPrsCreateDto } from './dto/ops/prs/maruti-prs-create.dto';
import { MarutiPrsUpdateScannedDto } from './dto/ops/prs/maruti-prs-update-scanned.dto';
import { MarutiPrsUpdateStatusDto } from './dto/ops/prs/maruti-prs-update-status.dto';
import { MarutiTrackingResponse } from './dto/response/maruti-tracking-response.dto';
import { MarutiLabelInvoiceResponse } from './dto/response/maruti-label-invoice-response.dto';
import { MarutiEcommBookingResponse } from './dto/response/maruti-ecomm-booking-response.dto';

type MarutiClientConfig = {
  env: 'PROD' | 'QA';
  username: string;
  password: string;
  accessToken?: string;
  expiresAt?: Date;
};

export class MarutiClient {
  private httpSeller: AxiosInstance;
  private httpDrs: AxiosInstance;
  private httpPrs: AxiosInstance;

  private accessToken?: string;
  private expiresAt?: Date;

  constructor(private readonly config: MarutiClientConfig) {
    this.accessToken = config.accessToken;
    this.expiresAt = config.expiresAt;

    const sellerBase =
      config.env === 'PROD'
        ? MARUTI_BASE_URL.PROD
        : MARUTI_BASE_URL.QA;

    this.httpSeller = axios.create({
      baseURL: sellerBase,
      timeout: 20_000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.httpDrs = axios.create({
      baseURL: MARUTI_BASE_URL.DRS,
      timeout: 20_000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.httpPrs = axios.create({
      baseURL: MARUTI_BASE_URL.QA,
      timeout: 20_000,
      headers: { 'Content-Type': 'application/json' },
    });

    if (this.accessToken) {
      this.setAuthHeader();
    }
  }

  /* ==========================
     TOKEN MANAGEMENT
  ========================== */

  private isTokenExpired() {
    if (!this.accessToken || !this.expiresAt) return true;
    return Date.now() >= this.expiresAt.getTime();
  }

  async getValidToken(): Promise<string> {
    if (!this.isTokenExpired()) return this.accessToken!;

    if (this.accessToken) {
      try {
        await this.refreshToken();
        return this.accessToken!;
      } catch {
        // fall through to login
      }
    }

    await this.login();
    return this.accessToken!;
  }

  /* ==========================
     LOGIN / REFRESH
  ========================== */

  private async login() {
    const res = await this.httpSeller.post(
      MARUTI_ENDPOINTS.LOGIN,
      {
        username: this.config.username,
        password: this.config.password,
      },
    );

    const token = res.data?.access_token;
    const expiresIn = res.data?.expires_in ?? 86400;

    if (!token) throw new Error('Maruti login failed');

    this.accessToken = token;
    this.expiresAt = new Date(Date.now() + expiresIn * 1000);
    this.setAuthHeader();
  }

  private async refreshToken() {
    const res = await this.httpSeller.post(
      MARUTI_ENDPOINTS.REFRESH_TOKEN,
      {},
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );

    const token = res.data?.access_token;
    if (!token) throw new Error('Maruti refresh failed');

    this.accessToken = token;
    this.expiresAt = new Date(Date.now() + 86400 * 1000);
    this.setAuthHeader();
  }

  private setAuthHeader() {
    const auth = `Bearer ${this.accessToken}`;
    this.httpSeller.defaults.headers.common.Authorization = auth;
    this.httpDrs.defaults.headers.common.Authorization = auth;
  }

  /* ==========================
     INTERNAL HELPERS
  ========================== */

  private async sellerPost<T>(url: string, body: any) {
    await this.getValidToken();
    return this.httpSeller.post<T>(url, body);
  }

  private async sellerGet<T>(url: string, params?: any) {
    await this.getValidToken();
    return this.httpSeller.get<T>(url, { params });
  }

  private async drsPost<T>(url: string, body: any) {
    await this.getValidToken();
    return this.httpDrs.post<T>(url, body);
  }

  private async drsGet<T>(url: string, params?: any) {
    await this.getValidToken();
    return this.httpDrs.get<T>(url, { params });
  }

  private prsPost<T>(url: string, body: any) {
    return this.httpPrs.post<T>(url, body, {
      headers: { authtype: 'firebase' },
    });
  }

  private prsPatch<T>(url: string, body: any, params?: any) {
    return this.httpPrs.patch<T>(url, body, {
      params,
      headers: { authtype: 'firebase' },
    });
  }

  private prsGet<T>(url: string) {
    return this.httpPrs.get<T>(url, {
      headers: { authtype: 'firebase' },
    });
  }

  /* ==========================
     SELLER APIs
  ========================== */

  checkServiceability(payload: {
    fromPincode: string;
    toPincode: string;
    isCodOrder: boolean;
    deliveryMode: string;
  }) {
    return this.sellerPost(
      MARUTI_ENDPOINTS.ECOMM_SERVICEABILITY,
      {
        originPincode: payload.fromPincode,
        destinationPincode: payload.toPincode,
        isCodOrder: payload.isCodOrder,
        deliveryMode: payload.deliveryMode,
      },
    );
  }

  checkHyperlocalServiceability(payload: any) {
    return this.sellerPost(
      MARUTI_ENDPOINTS.HYPERLOCAL_SERVICEABILITY,
      {
        orderType: 'HYPERLOCAL',
        pickupAddress: payload.pickupAddress,
        shippingAddress: payload.shippingAddress,
      },
    );
  }

  calculateEcommRate(payload: MarutiEcommRateDto) {
    return this.sellerPost(
      MARUTI_ENDPOINTS.ECOMM_RATE_CALCULATION,
      payload,
    );
  }

  trackEcommOrder(params: {
    awbNumber?: string;
    cAwbNumber?: string;
  }) {
    const orderId = params.awbNumber ?? params.cAwbNumber;
    return this.sellerGet<MarutiTrackingResponse>(
      `${MARUTI_ENDPOINTS.ECOMM_TRACKING}/${orderId}`,
    );
  }

  async trackHyperlocalOrder(awbNumber: string) {
    return this.sellerGet<MarutiTrackingResponse>(
      `${MARUTI_ENDPOINTS.HYPERLOCAL_TRACKING}/${awbNumber}`,
    );
  }

  createEcommManifest(payload: {
    awbNumber?: string;
    cAwbNumber?: string;
  }) {
    return this.sellerPost(
      MARUTI_ENDPOINTS.ECOMM_CREATE_MANIFEST,
      payload,
    );
  }

  cancelOrder(payload: { orderId: string; cancelReason: string }) {
    return this.sellerPost(
      MARUTI_ENDPOINTS.CANCEL_ORDER,
      payload,
    );
  }

  getEcommLabelInvoiceUrls(params: {
    awbNumber?: string;
    cAwbNumber?: string;
  }) {
    return this.sellerGet<MarutiLabelInvoiceResponse>(
      MARUTI_ENDPOINTS.ECOMM_LABEL_INVOICE,
      params,
    );
  }

  createEcommOrder(payload: MarutiEcommBookingDto) {
    return this.sellerPost<MarutiEcommBookingResponse>(
      MARUTI_ENDPOINTS.ECOMM_PUSH_ORDER,
      payload,
    );
  }

  createHyperlocalOrder(payload: MarutiHyperlocalBookingDto) {
    return this.sellerPost<MarutiEcommBookingResponse>(
      MARUTI_ENDPOINTS.HYPERLOCAL_PUSH_ORDER,
      payload,
    );
  }

  /* ==========================
     DRS APIs (COSMO)
  ========================== */

  updateDrsStatus(payload: MarutiDrsUpdateDto) {
    return this.drsPost(
      MARUTI_ENDPOINTS.DRS_DELIVERY_STATUS_UPDATE,
      payload,
    );
  }

  createDrs(payload: MarutiCreateDrsDto) {
    return this.drsPost(
      MARUTI_ENDPOINTS.CREATE_DRS,
      payload,
    );
  }

  getDrsShipmentList(daId: string) {
    return this.drsGet(
      MARUTI_ENDPOINTS.DRS_SHIPMENT_LIST,
      { daId },
    );
  }

  validateAwbs(payload: MarutiValidateAwbDto) {
    return this.drsPost(
      MARUTI_ENDPOINTS.VALIDATE_AWBS,
      payload,
    );
  }

  /* ==========================
     PRS APIs (FIREBASE)
  ========================== */

  createPrs(payload: MarutiPrsCreateDto) {
    return this.prsPost(
      MARUTI_ENDPOINTS.CREATE_PRS,
      payload,
    );
  }

  updatePrsScannedStatus(payload: MarutiPrsUpdateScannedDto) {
    return this.prsPatch(
      MARUTI_ENDPOINTS.PRS_UPDATE_SCANNED_STATUS,
      payload,
      { authtype: 'firebase' },
    );
  }

  updatePrsStatus(payload: MarutiPrsUpdateStatusDto) {
    return this.prsPatch(
      MARUTI_ENDPOINTS.PRS_UPDATE_STATUS,
      payload,
    );
  }

  getAllPrsOrders(prsNumber: string) {
    return this.prsGet(
      `${MARUTI_ENDPOINTS.PRS_GET_ALL_ORDERS}/${prsNumber}`,
    );
  }
}
