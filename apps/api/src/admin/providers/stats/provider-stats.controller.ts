import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";
import { RolesGuard } from "../../../common/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { ProviderStatsService } from "./provider-stats.service";

@Controller('admin/providers/stats/:provider/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin')
export class ProviderStatsController {
  constructor(private readonly service: ProviderStatsService) {}

  @Get()
  getStats(@Param('provider') provider: string) {
    return this.service.getStats(provider.toUpperCase());
  }
}