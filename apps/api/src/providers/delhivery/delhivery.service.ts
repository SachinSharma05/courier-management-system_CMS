import { Injectable, BadRequestException } from '@nestjs/common';
import { DelhiveryClient } from './delhivery.client';
import { mapCreateShipment } from './delhivery.mapper';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { CalculateRateDto } from './dto/rate.dto';
import { ListShipmentsDto } from './dto/list-shipments.dto';
import { consignments, pincodes, rateCards, rateCardSlabs, zoneMappings } from '../../db/schema';
import { sql, desc, eq, isNull, lte, or, gte, and } from 'drizzle-orm';
import { db } from '../../db';

@Injectable()
export class DelhiveryService {
  private client: DelhiveryClient;
  constructor() {
    this.client = new DelhiveryClient(process.env.DELHIVERY_TOKEN!);
  }

  getPincodeTat(pin: string) {
    return this.client.get(
      '/c/api/pin-codes/json/',
      { filter_codes: pin },
    );
  }

  // CORRECT: Pass the clean data object
  getTat(originPin: string, destinationPin: string, mot: string) {
    return this.client.trackGet('/api/dc/expected_tat', {
      origin_pin: originPin, 
      destination_pin: destinationPin, 
      mot 
    });
  }

  async calculateRate(dto: CalculateRateDto) {
    const {
      originPin,        // still useful later
      destinationPin,
      weight,
      serviceType,
      paymentType,
      codAmount,
      client_id,
      provider
    } = dto;

    // 1️⃣ Resolve zone_code (NEW LOGIC)
    const zoneCode = await this.resolveZoneCode(
      provider,
      serviceType,
      destinationPin,
    );

    // 2️⃣ Find active rate card
    const today = new Date().toISOString().slice(0, 10);

    const whereConditions = [
      eq(rateCards.provider, provider),
      eq(rateCards.service_type, serviceType),
      eq(rateCards.is_active, true),
      lte(rateCards.effective_from, today),
      or(
        isNull(rateCards.effective_to),
        gte(rateCards.effective_to, today),
      ),
    ];

    // 👇 ONLY apply client logic for providers that support it
    if (provider === 'dtdc' && client_id) {
      whereConditions.push(eq(rateCards.client_id, client_id));
    } else {
      whereConditions.push(isNull(rateCards.client_id));
    }

    const rateCard = await db
    .select()
    .from(rateCards)
    .where(and(...whereConditions))
    .orderBy(desc(rateCards.client_id)) // safe
    .limit(1)
    .then(r => r[0]);

    if (!rateCard) {
      throw new Error('Rate card not found');
    }

    // 3️⃣ Find matching slab
    const slab = await db
      .select()
      .from(rateCardSlabs)
      .where(
        and(
          eq(rateCardSlabs.rate_card_id, rateCard.id),
          eq(rateCardSlabs.zone_code, zoneCode),
          lte(rateCardSlabs.min_weight_g, weight),
          or(
            isNull(rateCardSlabs.max_weight_g),
            gte(rateCardSlabs.max_weight_g, weight),
          ),
        ),
      )
      .limit(1)
      .then(r => r[0]);

    if (!slab) {
      throw new Error('Rate slab not found');
    }

    // 4️⃣ Final amount (extend later)
    const base = Number(slab.rate);
    const total = base;

    return {
      zone: zoneCode,
      slab_type: slab.slab_type,
      rate: base,
      breakdown: {
        base,
        total,
      },
    };
  }

  async resolveZoneCode(
  provider: string,
  serviceType: 'surface' | 'express',
  destinationPin: string,
  ) {
    // 1️⃣ Get zone_group from pincodes
    const pin = await db
      .select({
        zone_group: pincodes.zone_group,
      })
      .from(pincodes)
      .where(
        and(
          eq(pincodes.provider, provider),
          eq(pincodes.pincode, destinationPin),
        ),
      )
      .then(r => r[0]);

    if (!pin) {
      throw new BadRequestException(
        `Pincode ${destinationPin} not found for provider ${provider}`,
      );
    }

    if (!pin.zone_group) {
      throw new BadRequestException(
        `Zone group not assigned for pincode ${destinationPin}`,
      );
    }

    // 2️⃣ Get zone_code from zone_mappings
    const mapping = await db
      .select({
        zone_code: zoneMappings.zone_code,
      })
      .from(zoneMappings)
      .where(
        and(
          eq(zoneMappings.provider, provider),
          eq(zoneMappings.service_type, serviceType),
          eq(zoneMappings.origin_group, 'METRO'), // fixed pickup
          eq(zoneMappings.destination_group, pin.zone_group),
        ),
      )
      .then(r => r[0]);

    if (!mapping?.zone_code) {
      throw new Error('Zone code mapping not found');
    }

    return mapping.zone_code;
  }

  createShipment(dto: CreateShipmentDto) {
    const payload = mapCreateShipment(dto);

    return this.client.post(
      '/api/cmu/create.json',
      payload,
    );
  }

  async generateLabel(waybill: string) {
    if (!waybill) {
      throw new Error('Waybill is required');
    }

    const response = await this.client.trackGet(
      '/api/p/packing_slip',
      {
        wbns: waybill,     // MUST be exactly "wbns"
        pdf: true,
        pdf_size: 'A4',
      },
    );

    return response;
  }

  async updateShipment(waybill: string, payload: any) {
    try {
      // 🔑 Delhivery expects FLAT payload
      const data = {
        waybill,
        ...payload,
      };

      return await this.client.trackPost(
        '/api/p/edit',
        data,
      );
    } catch (err: any) {
      throw new BadRequestException(
        err.response?.data || err.message || 'Delhivery update failed',
      );
    }
  }

  async resolveNdr(
    waybill: string,
    act: 'RE-ATTEMPT' | 'PICKUP_RESCHEDULE',
  ) {
    try {
      return await this.client.trackPost(
        '/api/p/update',
        {
          waybill,
          act, // EXACT key as per Delhivery docs
        },
      );
    } catch (err: any) {
      throw new BadRequestException(
        err.response?.data || err.message || 'Delhivery NDR failed',
      );
    }
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

  // apps/api/src/providers/delhivery/delhivery.service.ts
  async getShipmentDetails(waybill: string, refId?: string) {
    try {
      const params: any = { waybill };

      if (refId) {
        params.ref_ids = refId;
      }

      const response = await this.client.trackGet(
        '/api/v1/packages/json/',
        params,
      ) as {
        ShipmentData?: Array<{
          Shipment?: any;
        }>;
      };

      const shipment = response?.ShipmentData?.[0]?.Shipment;

      if (!shipment) {
        throw new BadRequestException('Shipment not found');
      }

      return {
        awb: shipment.AWB,
        order_id: shipment.ReferenceNo,
        status: shipment.Status?.Status,
        status_type: shipment.Status?.StatusType,
        pickup_date: shipment.PickupDate,
        consignee: {
          name: shipment.Consignee?.Name,
          phone: shipment.Consignee?.Phone,
          address: shipment.Consignee?.Address,
          city: shipment.Consignee?.City,
          pincode: shipment.Consignee?.Pincode,
        },
        shipper: {
          name: shipment.Shipper?.Name,
          city: shipment.Shipper?.City,
          pincode: shipment.Shipper?.Pincode,
        },
        payment: {
          type: shipment.Payment,
          cod_amount: shipment.CODAmount,
        },
        // is_cancellable: this.isCancellable(pkg.Status?.Status),
        raw: shipment, // keep full payload for UI debug
      };
    } catch (err: any) {
      throw new BadRequestException(
        err.response?.data || err.message || 'Delhivery API error',
      );
    }
  }

  async cancelShipment(waybill: string) {
    try {
      const response = await this.client.trackPost(
        '/api/p/edit',
        {
          waybill,
          cancellation: 'true', // exact key as per Delhivery docs
        },
      );

      return response;
    } catch (err: any) {
      throw new BadRequestException(
        err.response?.data || err.message || 'Delhivery cancel failed',
      );
    }
  }

  async createPickupRequest(payload: {
    pickup_date: string;
    pickup_time: string;
    pickup_location: string;
    expected_package_count: number;
  }) {
    try {
      return await this.client.trackPost(
        '/fm/request/new/',
        {
          pickup_date: payload.pickup_date,               // YYYY-MM-DD
          pickup_time: payload.pickup_time,               // HH:mm:ss
          pickup_location: payload.pickup_location,       // exact warehouse name
          expected_package_count: payload.expected_package_count,
        },
      );
    } catch (err: any) {
      throw new BadRequestException(
        err.response?.data || err.message || 'Delhivery pickup request failed',
      );
    }
  }

}