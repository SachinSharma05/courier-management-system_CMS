import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { sql, desc, eq, asc } from 'drizzle-orm';
import { commodities, consignments, users } from '../../db/schema';
import { db } from '../../db';
import { computeMovement, computeTAT } from '../../admin/consignments/tat.engine';
import { DtdcClient } from './dtdc.client';
import { DtdcServiceabilityDto } from './dto/serviceability.dto';
import { DtdcPriceTatPayload } from './dto/DtdcPriceTatDto';

@Injectable()
export class DtdcService {
    private readonly client: DtdcClient;

    constructor() {
      this.client = new DtdcClient();
    }

    async checkServiceability(dto: DtdcServiceabilityDto) {
      return this.client.checkServiceability(
        dto.origin_pincode,
        dto.destination_pincode,
      );
    }

    async checkPriceTat(dto: DtdcPriceTatPayload) {
      return this.client.checkPriceTat(dto);
    }

    async getCommodities(){
      try {
        return await db
          .select({
            id: commodities.commodityId,
            name: commodities.commodityName,
            code: commodities.commodityCode,
          })
          .from(commodities)
          .orderBy(asc(commodities.commodityName));
      } catch (error) {
        console.error("Error fetching commodities:", error);
        throw new Error("Could not fetch commodities");
      }
    }

    async getSinglePincodeServiceability(src: string) {
      return this.client.checkSinglePincodeServiceability(src);
    }

  // 🚧 STUBS (we’ll implement later)

  async printLabel(awb: string) {
    return { message: `Print label for ${awb} – TODO` };
  }

  async cancelShipment(awb: string) {
    return { message: `Cancel shipment ${awb} – TODO` };
  }

  async getNdr(awb: string) {
    return { message: `Get NDR for ${awb} – TODO` };
  }
}