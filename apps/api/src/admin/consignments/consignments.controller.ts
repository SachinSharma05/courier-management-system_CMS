import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ConsignmentsService } from './consignments.service';
import { FastifyReply } from 'fastify';
import { ListConsignmentsDto } from './dto/list-consignments.dto';

@Controller('admin/consignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'ops', 'client')
export class ConsignmentsController {
  constructor(private readonly service: ConsignmentsService) {}

  @Get()
  list(
    @Query() query: ListConsignmentsDto,
  ) {
    return this.service.list({
      ...query,
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 50),
      
    });
  }

  @Get('export')
  @Roles('super_admin', 'admin')
  async exportCSV(
    @Query() query: ListConsignmentsDto,
    @Res() res: FastifyReply,
  ) {
    const csv = await this.service.exportCSV(query);

    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      `attachment; filename="consignments_${Date.now()}.csv"`
    );

    return res.send(csv);
  }

  @Get('summary')
  @Roles('super_admin', 'admin')
  async summary(@Query('clientId') clientId?: string) {
    return this.service.getSummary(
      clientId ? Number(clientId) : undefined
    );
  }
}