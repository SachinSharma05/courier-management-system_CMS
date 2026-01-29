import { Controller, Get, Post, Query, Body, BadRequestException, Param } from '@nestjs/common';
import { DtdcService } from './dtdc.service';
import { DtdcServiceabilityDto } from './dto/serviceability.dto';
import { DtdcPriceTatPayload } from './dto/DtdcPriceTatDto';

@Controller('providers/dtdc')
export class DtdcController {
    constructor(private readonly service: DtdcService) {}

  // 🔹 1. Serviceability
  @Post('/serviceability')
  async serviceability(@Body() dto: DtdcServiceabilityDto) {
    return this.service.checkServiceability(dto);
  }

  // Price TAT
  @Post('/priceTat')
  async priceTat(@Body() payload: DtdcPriceTatPayload){
    return this.service.checkPriceTat(payload);
  }

  // Commodities
  @Get('/commodities')
  async getCommodities(){
    return this.service.getCommodities();
  }

  // Single Pincode Serviceability
  @Get('/singlepincode/:src')
  async getSinglePincodeServiceability(@Param('src') src: string) {
    return this.service.getSinglePincodeServiceability(src);
  }

  // 🔹 2. Create Shipment (stub)
  @Post('/shipments')
  async createShipment(@Body() payload: any) {
    return { message: 'DTDC create shipment – TODO' };
  }

  // 🔹 3. Bulk Shipment (stub)
  @Post('/shipments/bulk')
  async bulkShipment(@Body() payload: any) {
    return { message: 'DTDC bulk shipment – TODO' };
  }

  // 🔹 4. Print Label
  @Get('/label/:awb')
  async printLabel(@Param('awb') awb: string) {
    return this.service.printLabel(awb);
  }

  // 🔹 5. Cancel Shipment
  @Post('/cancel/:awb')
  async cancelShipment(@Param('awb') awb: string) {
    return this.service.cancelShipment(awb);
  }

  // 🔹 6. NDR
  @Get('/ndr/:awb')
  async getNdr(@Param('awb') awb: string) {
    return this.service.getNdr(awb);
  }
}