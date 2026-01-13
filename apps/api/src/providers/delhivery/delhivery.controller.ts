import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { DelhiveryService } from './delhivery.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { CalculateRateDto } from './dto/rate.dto';
import { ResolveNdrDto } from './dto/ndr.dto';
import { ListShipmentsDto } from './dto/list-shipments.dto';

@Controller('providers/delhivery')
export class DelhiveryController {
  constructor(private readonly service: DelhiveryService) {}

  @Get('pincode')
  getPincode(@Query('pin') pin: string) {
    return this.service.getPincodeTat(pin);
  }

  @Post('rate')
  calculateRate(@Body() dto: CalculateRateDto) {
    return this.service.calculateRate(dto);
  }

  @Post('shipment')
  createShipment(@Body() dto: CreateShipmentDto) {
    return this.service.createShipment(dto);
  }

  @Get('label')
  generateLabel(@Query('waybill') waybill: string) {
    return this.service.generateLabel(waybill);
  }

  @Post('update')
  updateShipment(@Body() body: { waybill: string; payload: any }) {
    return this.service.updateShipment(body.waybill, body.payload);
  }

  @Get('ndr')
  getNdr(@Query('waybill') waybill: string) {
    return this.service.getNdrDetails(waybill);
  }

  @Post('ndr/resolve')
  resolveNdr(@Body() dto: ResolveNdrDto) {
    return this.service.resolveNdr(dto);
  }

  @Get('shipments')
  getShipments(@Query() query: ListShipmentsDto) {
    return this.service.listShipments('DELHIVERY', query);
  }

}