import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { DelhiveryService } from './delhivery.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { CalculateRateDto } from './dto/rate.dto';
import { ListShipmentsDto } from './dto/list-shipments.dto';

@Controller('providers/delhivery')
export class DelhiveryController {
  constructor(private readonly service: DelhiveryService) {}

  @Get('pincode')
  getPincode(@Query('pin') pin: string) {
    return this.service.getPincodeTat(pin);
  }

  @Get('tat')
  async getTat(
    @Query('origin_pin') origin_pin: string, 
    @Query('destination_pin') destination_pin: string, 
    @Query('mot') mot: string
  ) {
    return this.service.getTat(origin_pin, destination_pin, mot);
  }

  @Post('rate')
  calculateRate(@Body() dto: CalculateRateDto) {
    return this.service.calculateRate(dto);
  }

  @Post('create')
  createShipment(@Body() dto: CreateShipmentDto) {
    return this.service.createShipment(dto);
  }

  @Get('label')
  generateLabel(@Query('waybill') waybill: string) {
    return this.service.generateLabel(waybill);
  }

  @Post('update')
  updateShipment(
    @Body() body: { waybill: string; payload: any }
  ) {
    if (!body.waybill) {
      throw new BadRequestException('waybill is required');
    }

    return this.service.updateShipment(body.waybill, body.payload);
  }

  @Post('ndr')
  resolveNdr(
    @Body() body: { waybill: string; act: 'RE-ATTEMPT' | 'PICKUP_RESCHEDULE' },
  ) {
    if (!body.waybill || !body.act) {
      throw new BadRequestException('waybill and act are required');
    }

    return this.service.resolveNdr(body.waybill, body.act);
  }

  @Get('list')
  getShipments(@Query() query: ListShipmentsDto) {
    return this.service.listShipments('DELHIVERY', query);
  }

  @Get('shipment')
  getShipmentDetails(
    @Query('waybill') waybill: string,
    @Query('ref_id') refId?: string,
  ) {
    if (!waybill) {
      throw new BadRequestException('waybill is required');
    }

    return this.service.getShipmentDetails(waybill, refId);
  }

  @Post('cancel')
  cancelShipment(@Body() body: { waybill: string }) {
    if (!body.waybill) {
      throw new BadRequestException('waybill is required');
    }

    return this.service.cancelShipment(body.waybill);
  }

  @Post('pickup-request')
  createPickupRequest(
    @Body() body: {
      pickup_date: string;              // YYYY-MM-DD
      pickup_time: string;              // HH:mm:ss
      pickup_location: string;          // registered warehouse name
      expected_package_count: number;   // integer
    },
  ) {
    const {
      pickup_date,
      pickup_time,
      pickup_location,
      expected_package_count,
    } = body;

    if (
      !pickup_date ||
      !pickup_time ||
      !pickup_location ||
      !expected_package_count
    ) {
      throw new BadRequestException(
        'pickup_date, pickup_time, pickup_location, expected_package_count are required',
      );
    }

    return this.service.createPickupRequest(body);
  }

}