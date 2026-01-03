import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdvancesService } from './advances.service';
import { CreateAdvanceDto } from '../dto/create-advance.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/employees/advances')
export class AdvancesController {
  constructor(private readonly advancesService: AdvancesService) {}

  // POST /admin/advances
  @Post()
  create(@Body() dto: CreateAdvanceDto) {
    return this.advancesService.create(dto);
  }

  // GET /admin/advances/:employeeId
  @Get(':employeeId')
  findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.advancesService.findByEmployee(employeeId);
  }

  // GET /admin/advances/:employeeId/outstanding
  @Get(':employeeId/outstanding')
  getOutstanding(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.advancesService.getOutstanding(employeeId);
  }
}