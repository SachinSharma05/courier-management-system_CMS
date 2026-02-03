import { Injectable } from '@nestjs/common';
import { MarutiClient } from './maruti.client';
import { MarutiServiceabilityDto } from './dto/serviceability.dto';
import { MarutiHyperlocalServiceabilityDto } from './dto/maruti-hyperlocal-serviceability.dto';
import { MarutiEcommRateDto } from './dto/maruti-rate.dto';
import { MarutiEcommTrackingDto } from './dto/maruti-ecomm-tracking.dto';
import { MARUTI_STATUS_MAP, MarutiNormalizedStatus } from './maruti.tracking-status';
import { MarutiHyperlocalTrackingDto } from './dto/maruti-hyperlocal-tracking.dto';
import { MARUTI_HYPERLOCAL_STATUS_MAP, MarutiHyperlocalNormalizedStatus } from './maruti.hyperlocal-status';
import { MarutiEcommManifestDto } from './dto/maruti-ecomm-manifest.dto';
import { MarutiCancelOrderDto } from './dto/maruti-cancel.dto';
import { MarutiEcommLabelDto } from './dto/maruti-ecomm-label.dto';
import { MarutiEcommBookingDto } from './dto/maruti-ecomm-booking.dto';
import { MarutiHyperlocalBookingDto } from './dto/maruti-hyperlocal-booking.dto';
import { MarutiDrsUpdateDto } from './dto/ops/drs/maruti-drs-update.dto';
import { MarutiCreateDrsDto } from './dto/ops/drs/maruti-create-drs.dto';
import { MarutiDrsListDto } from './dto/ops/drs/maruti-drs-list.dto';
import { MarutiValidateAwbDto } from './dto/ops/drs/maruti-validate-awb.dto';
import { MarutiPrsCreateDto } from './dto/ops/prs/maruti-prs-create.dto';
import { MarutiPrsUpdateScannedDto } from './dto/ops/prs/maruti-prs-update-scanned.dto';
import { MarutiPrsUpdateStatusDto } from './dto/ops/prs/maruti-prs-update-status.dto';
import { MarutiPrsListDto } from './dto/ops/prs/maruti-prs-list.dto';

@Injectable()
export class MarutiService {
  // 🔐 in-memory cache (server-side)
  private accessToken: string | null = null;
  private expiresAt: Date | null = null;

  private getClient() {
    return new MarutiClient({
      env: process.env.MARUTI_ENV as 'PROD' | 'QA',
      username: process.env.MARUTI_USERNAME!,
      password: process.env.MARUTI_PASSWORD!,
      accessToken: this.accessToken ?? undefined,
      expiresAt: this.expiresAt ?? undefined,
    });
  }

  /* ==========================
     AUTH / TOKEN TEST
  ========================== */

  async testAuth() {
    const client = this.getClient();

    const token = await client.getValidToken();

    // 🔁 sync back to cache
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      ok: true,
      expires_at: this.expiresAt,
    };
  }

  async checkServiceability(dto: MarutiServiceabilityDto) {
    const client = this.getClient();

    const res = await client.checkServiceability(dto);

    // sync refreshed token back to cache
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return res.data;
  }

  async checkHyperlocalServiceability(
    dto: MarutiHyperlocalServiceabilityDto,
  ) {
    const client = this.getClient();

    const res = await client.checkHyperlocalServiceability(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return res.data;
  }

  async calculateEcommRate(dto: MarutiEcommRateDto) {
    const client = this.getClient();

    const res = await client.calculateEcommRate(dto);

    // sync refreshed token back to cache
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return res.data;
  }

  async trackEcomm(dto: MarutiEcommTrackingDto) {
    const client = this.getClient();

    const res = await client.trackEcommOrder(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    const raw = res.data;

    // 🔄 normalize status (safe fallback)
    const rawStatus: string | undefined =
      raw?.orderStatus ?? raw?.status;

    const normalized: MarutiNormalizedStatus | null =
      rawStatus && MARUTI_STATUS_MAP[rawStatus]
        ? MARUTI_STATUS_MAP[rawStatus]
        : null;

    return {
      provider: 'MARUTI',
      awb: dto.awbNumber ?? null,
      cAwb: dto.cAwbNumber ?? null,
      current_status: rawStatus ?? null,
      normalized_status: normalized,
      raw,
    };
  }

  async trackHyperlocal(dto: MarutiHyperlocalTrackingDto) {
    const client = this.getClient();

    const res = await client.trackHyperlocalOrder(dto.awbNumber);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    const raw = res.data;

    const rawStatus: string | undefined =
      raw?.orderStatus ?? raw?.status;

    const normalized: MarutiHyperlocalNormalizedStatus | null =
      rawStatus && MARUTI_HYPERLOCAL_STATUS_MAP[rawStatus]
        ? MARUTI_HYPERLOCAL_STATUS_MAP[rawStatus]
        : null;

    return {
      provider: 'MARUTI',
      awb: dto.awbNumber,
      current_status: rawStatus ?? null,
      normalized_status: normalized,
      raw,
    };
  }

  async createEcommManifest(dto: MarutiEcommManifestDto) {
    const client = this.getClient();

    const res = await client.createEcommManifest(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      awb: dto.awbNumber ?? null,
      cAwb: dto.cAwbNumber ?? null,
      raw: res.data,
    };
  }

  async cancelOrder(dto: MarutiCancelOrderDto) {
    const client = this.getClient();

    const res = await client.cancelOrder(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      orderId: dto.orderId,
      status: 'CANCEL_REQUESTED',
      raw: res.data,
    };
  }

  async getEcommLabelInvoice(dto: MarutiEcommLabelDto) {
    const client = this.getClient();

    const res = await client.getEcommLabelInvoiceUrls(dto);

    // sync token cache
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    const data = res.data?.data ?? [];

    return {
        provider: 'MARUTI',
        success: res.data?.success ?? false,
        documents: data.map(d => ({
          awb: d.awbNumber,
          invoice_url: d.invoiceUrl,
          label_url: d.shippingLabelUrl,
        })),
        message: res.data?.message,
    };
  }

  async createEcommOrder(dto: MarutiEcommBookingDto) {
    const client = this.getClient();

    const res = await client.createEcommOrder(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      orderId: dto.orderId,
      success: res.data?.success ?? true,
      awb: res.data?.awbNumber ?? null,
      cAwb: res.data?.cAwbNumber ?? null,
      raw: res.data,
    };
  }

  async createHyperlocalOrder(
    dto: MarutiHyperlocalBookingDto,
  ) {
    const client = this.getClient();

    const res = await client.createHyperlocalOrder(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      orderId: dto.orderId,
      orderNumber: dto.orderNumber,
      success: res.data?.success ?? true,
      awb: res.data?.awbNumber ?? null,
      raw: res.data,
    };
  }

  async updateDrsStatus(dto: MarutiDrsUpdateDto) {
    const client = this.getClient();

    const res = await client.updateDrsStatus(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      type: 'DRS_UPDATE',
      cAwb: dto.cAWB_No,
      delivered: dto.is_delivered,
      timestamp: dto.status_timestamp,
      raw: res.data,
    };
  }

  async createDrs(dto: MarutiCreateDrsDto) {
    const client = this.getClient();

    const res = await client.createDrs(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      type: 'CREATE_DRS',
      awbCount: dto.awbList.length,
      daId: dto.daId,
      raw: res.data,
    };
  }

  async getDrsShipmentList(dto: MarutiDrsListDto) {
    const client = this.getClient();

    const res = await client.getDrsShipmentList(dto.daId);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      type: 'DRS_LIST',
      daId: dto.daId,
      raw: res.data,
    };
  }

  async validateAwbs(dto: MarutiValidateAwbDto) {
    const client = this.getClient();

    const res = await client.validateAwbs(dto);

    // sync refreshed token back
    this.accessToken = client['accessToken'];
    this.expiresAt = client['expiresAt'];

    return {
      provider: 'MARUTI',
      type: 'VALIDATE_AWBS',
      awbCount: dto.awbList.length,
      daId: dto.daId,
      raw: res.data,
    };
  }

  async createPrs(dto: MarutiPrsCreateDto) {
    const client = this.getClient();

    const res = await client.createPrs(dto);

    return {
      provider: 'MARUTI',
      type: 'CREATE_PRS',
      awbCount: dto.awbNumberList.length,
      source: dto.source,
      raw: res.data,
    };
  }

  async updatePrsScannedStatus(
    dto: MarutiPrsUpdateScannedDto,
  ) {
    const client = this.getClient();

    const res = await client.updatePrsScannedStatus(dto);

    return {
      provider: 'MARUTI',
      type: 'PRS_UPDATE_SCANNED',
      prsNumber: dto.prsNumber,
      deliveryAgentId: dto.deliveryAgentId,
      awbCount: dto.awbNumberList.length,
      raw: res.data,
    };
  }

  async updatePrsStatus(
    dto: MarutiPrsUpdateStatusDto,
  ) {
    const client = this.getClient();

    const res = await client.updatePrsStatus(dto);

    return {
      provider: 'MARUTI',
      type: 'PRS_UPDATE_STATUS',
      prsNumber: dto.prsNumber,
      status: dto.status,
      raw: res.data,
    };
  }

  async getAllPrsOrders(dto: MarutiPrsListDto) {
    const client = this.getClient();

    const res = await client.getAllPrsOrders(dto.prsNumber);

    return {
      provider: 'MARUTI',
      type: 'PRS_LIST',
      prsNumber: dto.prsNumber,
      raw: res.data,
    };
  }

}

