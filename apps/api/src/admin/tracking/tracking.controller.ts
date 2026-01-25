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
    @Query('awb') awb: string, // Accept "AWB1,AWB2,AWB3"
  ) {
    // Clean the input: split by comma, remove whitespace, limit to 25
    const awbArray = awb.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 25);

    return this.service.trackMultipleByAwb(awbArray);
  }

}