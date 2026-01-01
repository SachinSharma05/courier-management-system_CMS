import { Body, Controller, Get, Post, Patch, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('admin/clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'ops', 'client')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  @Roles('super_admin')
  create(@Body() dto: CreateClientDto) {
    return this.service.createClient(dto);
  }

  @Patch(':id')
  @Roles('super_admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.service.updateClient(Number(id), dto);
  }
}
