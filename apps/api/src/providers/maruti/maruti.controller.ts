import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { MarutiService } from './maruti.service';
import { MarutiServiceabilityDto } from './dto/serviceability.dto';
import { MarutiHyperlocalServiceabilityDto } from './dto/maruti-hyperlocal-serviceability.dto';
import { MarutiEcommRateDto } from './dto/maruti-rate.dto';
import { MarutiEcommTrackingDto } from './dto/maruti-ecomm-tracking.dto';
import { MarutiHyperlocalTrackingDto } from './dto/maruti-hyperlocal-tracking.dto';
import { MarutiEcommManifestDto } from './dto/maruti-ecomm-manifest.dto';
import { MarutiCancelOrderDto } from './dto/maruti-cancel.dto';
import { MarutiEcommLabelDto } from './dto/maruti-ecomm-label.dto';
import { MarutiEcommBookingDto } from './dto/maruti-ecomm-booking.dto';
import { MarutiHyperlocalBookingDto } from './dto/maruti-hyperlocal-booking.dto';

@Controller('/admin/maruti')
export class MarutiController {
  constructor(private readonly service: MarutiService) {}

  // 🔐 Step 1: Test login + refresh
  @Get('/auth-test')
  async authTest() {
    return this.service.testAuth();
  }

  @Post('/serviceability')
  async serviceability(@Body() dto: MarutiServiceabilityDto) {
    return this.service.checkServiceability(dto);
  }

  @Post('/serviceability/hyperlocal')
  async hyperlocalServiceability(
    @Body() dto: MarutiHyperlocalServiceabilityDto,
  ) {
    return this.service.checkHyperlocalServiceability(dto);
  }

  @Post('/rate/ecomm')
  async calculateEcommRate(
    @Body() dto: MarutiEcommRateDto,
  ) {
    return this.service.calculateEcommRate(dto);
  }

  @Post('/tracking/ecomm')
  async trackEcomm(@Body() dto: MarutiEcommTrackingDto) {
    return this.service.trackEcomm(dto);
  }

  @Post('/tracking/hyperlocal')
  async trackHyperlocal(
    @Body() dto: MarutiHyperlocalTrackingDto,
  ) {
    return this.service.trackHyperlocal(dto);
  }

  @Post('/manifest/ecomm')
  async createEcommManifest(
    @Body() dto: MarutiEcommManifestDto,
  ) {
    return this.service.createEcommManifest(dto);
  }

  @Put('/cancel')
  async cancelOrder(@Body() dto: MarutiCancelOrderDto) {
    return this.service.cancelOrder(dto);
  }

  @Post('/label/ecomm')
  async getEcommLabelInvoice(@Body() dto: MarutiEcommLabelDto) 
  {
    return this.service.getEcommLabelInvoice(dto);
  }

  @Post('/booking/ecomm')
  async createEcommBooking(
    @Body() dto: MarutiEcommBookingDto,
  ) {
    return this.service.createEcommOrder(dto);
  }

  @Post('/booking/hyperlocal')
  async createHyperlocalBooking(
    @Body() dto: MarutiHyperlocalBookingDto,
  ) {
    return this.service.createHyperlocalOrder(dto);
  }
}
