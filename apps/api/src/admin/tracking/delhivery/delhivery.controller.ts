import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { DelhiveryService } from './delhivery.service';
import { BulkUploadDto } from '../bulk/bulk-tracking.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin/tracking/delhivery')
export class DelhiveryController {
  constructor(private readonly service: DelhiveryService) {}

  @Post('bulk')
  async bulkTrack(@Body() body: BulkUploadDto) {
    if (!body?.groups?.length) {
      throw new BadRequestException('No groups provided');
    }

    return this.service.processBulk(body.groups);
  }
}
