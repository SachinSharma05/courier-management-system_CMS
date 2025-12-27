import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/tracking')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  @Get()
  async track(
    @Query('awb') awb: string,
  ) {
    return this.service.trackByAwb(awb);
  }

}