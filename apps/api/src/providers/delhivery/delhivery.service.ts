import { Injectable } from '@nestjs/common';
import { DelhiveryClient } from './delhivery.client';
import { mapCreateShipment } from './delhivery.mapper';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { CalculateRateDto } from './dto/rate.dto';
import { ResolveNdrDto } from './dto/ndr.dto';
import { ListShipmentsDto } from './dto/list-shipments.dto';
import { consignments } from '../../db/schema';
import { sql, desc } from 'drizzle-orm';
import { db } from '../../db';

@Injectable()
export class DelhiveryService {
  private client: DelhiveryClient;

  constructor() {
    this.client = new DelhiveryClient(process.env.DELHIVERY_TOKEN!);
  }

  getPincodeTat(pin: string) {
    return this.client.get(
      '/api/pincode/v2/json/',
      { filter_codes: pin },
    );
  }

  calculateRate(dto: CalculateRateDto) {
    return this.client.get(
      '/api/kinko/v1/invoice/charges/.json',
      {
        md: 'S',
        ss: 'Delivered',
        o_pin: dto.originPin,
        d_pin: dto.destinationPin,
        cgm: dto.weight * 1000,
        pt: dto.paymentType,
        cod: dto.codAmount || 0,
      },
    );
  }

  createShipment(dto: CreateShipmentDto) {
    const payload = mapCreateShipment(dto);

    return this.client.post(
      '/api/cmu/create.json',
      payload,
    );
  }

  generateLabel(waybill: string) {
    return this.client.get(
      '/api/p/packing_slip',
      { wbns: waybill, pdf: true },
    );
  }

  updateShipment(waybill: string, payload: any) {
    return this.client.post(
      '/api/cmu/update.json',
      { waybill, ...payload },
    );
  }

  getNdrDetails(waybill: string) {
    return this.client.get(
      '/api/ndr/v1/ndr_details/',
      { waybill },
    );
  }

  resolveNdr(dto: ResolveNdrDto) {
    return this.client.post(
      '/api/ndr/v1/resolve/',
      dto,
    );
  }

  async listShipments(provider: string, q: ListShipmentsDto) {
    const offset = Math.max(0, (q.page - 1) * q.limit);

    // Start with the provider filter
    const where = [sql`${consignments.provider} = ${provider.toUpperCase()}`];

    // Only filter by status if it's not "all" or empty
    if (q.status && q.status !== 'all' && q.status !== '') {
      where.push(sql`${consignments.current_status} = ${q.status}`);
    }

    // Handle search with pre-formatted pattern
    if (q.search && q.search.trim() !== '') {
      const pattern = `%${q.search.trim()}%`;
      where.push(sql`${consignments.awb} ILIKE ${pattern}`);
    }

    // Join conditions with AND
    const finalWhere = sql.join(where, sql` AND `);

    const [rows, totalResult] = await Promise.all([
      db.select()
        .from(consignments)
        .where(finalWhere)
        .orderBy(desc(consignments.created_at))
        .limit(q.limit)
        .offset(offset),

      db.select({ count: sql`count(*)` })
        .from(consignments)
        .where(finalWhere)
    ]);

    const total = Number(totalResult[0]?.count || 0);

    return {
      data: rows,
      meta: {
        page: q.page,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    };
  }

}