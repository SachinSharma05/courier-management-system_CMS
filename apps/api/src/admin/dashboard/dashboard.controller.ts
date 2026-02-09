import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary')
  getSummary() 
  {
    return this.service.getSummary();
  }

  @Get('performance')
  getProviderPerformance() {
    return this.service.getProviderPerformance();
  }

  @Get('/shipment-ageing')
  shipmentAgeing() {
    return this.service.shipmentAgeing();
  }

  @Get('/get-daily-booking-trend')
  getDailyBookingTrend(@Query('days') days: number = 7) { // ✅ Correct: Extracts ?days= from URL
    return this.service.getDailyBookingTrend(Number(days));
  }

  @Get('/provider-share')
  providerShare() {
    return this.service.providerShare();
  }

  @Get('/stuck-shipments')
  stuckShipments() {
    return this.service.stuckShipments();
  }

  @Get('/yesterday-bookings')
  yesterdayBookings() {
    return this.service.yesterdayBookings();
  }
}