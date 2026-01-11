import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { DelhiveryService } from './delhivery.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/tracking/delhivery')
export class DelhiveryController {
  constructor(private readonly service: DelhiveryService) {}

  @Post('bulk')
  async bulkTrack(
    @Body()
    body: {
      clientId: number;
      awbs: string[];
    },
  ) {
    return this.service.processBulk(body.clientId, body.awbs);
  }
}
