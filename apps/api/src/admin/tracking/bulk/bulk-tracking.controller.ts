import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";
import { RolesGuard } from "../../../common/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { BulkUploadDto } from "./bulk-tracking.dto";
import { BulkTrackingService } from "./bulk-tracking.service";

@Controller('admin/tracking/bulk')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'ops')
export class BulkTrackingController {
  constructor(private readonly service: BulkTrackingService) {}

  @Post('dtdc')
  async process(@Body() body: BulkUploadDto) {
    if (!body?.groups?.length) {
      throw new BadRequestException('No groups provided');
    }
    return this.service.processDtdcBulk(body.groups);
  }
}
