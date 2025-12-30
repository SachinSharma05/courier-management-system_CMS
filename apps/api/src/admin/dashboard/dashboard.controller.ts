import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary')
  getSummary(
    @Query('clientId') clientId?: number,
    @Query('provider') provider?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.getSummary();
  }

  @Get('performance')
  getProviderPerformance() {
    return this.service.getProviderPerformance();
  }

  @Get('alerts')
  getAlerts() {
    return this.service.getAlerts();
  }
}
