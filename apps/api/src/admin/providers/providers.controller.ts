import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProvidersService } from './providers.service';

@Controller('admin/providers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'ops', 'client')
export class ProvidersController {
  constructor(private readonly service: ProvidersService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
