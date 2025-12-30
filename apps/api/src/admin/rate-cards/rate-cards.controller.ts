import {
  Controller,
  Get,
  Patch,
  Query,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { RateCardsService } from './rate-cards.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetRateCardDto } from './dto/get-rate-card.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Controller('admin/rate-cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RateCardsController {
  constructor(private readonly service: RateCardsService) {}

  /* ------------------------------
     GET RATE CARD
  ------------------------------ */
  @Get()
  @Roles('super_admin', 'admin')
  getRateCard(@Query() query: GetRateCardDto) {
    return this.service.getRateCard(
      query.provider,
      query.serviceType,
      query.clientId ?? null
    );
  }

  /* ------------------------------
     INLINE UPDATE (SUPER ADMIN)
  ------------------------------ */
  @Patch('rate')
  @Roles('super_admin')
  updateRate(@Body() body: UpdateRateDto) {
    return this.service.updateRate(
      body.rateCardId,
      body.zoneCode,
      body.slabType,
      body.rate,
    );
  }

  @Post('create')
  async createClientRateCard(
    @Body() body: {
      provider: string;
      serviceType: string;
      clientId: number;
      cloneFromGlobal?: boolean;
    }
  ) {
    return this.service.createClientRateCard(
      body.provider,
      body.serviceType,
      body.clientId,
      body.cloneFromGlobal ?? true,
    );
  }
}