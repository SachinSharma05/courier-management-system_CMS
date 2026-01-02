import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { ApplyLeaveDto } from '../dto/apply-leave.dto';
import { ApproveLeaveDto } from '../dto/approve-leave.dto';
import { RejectLeaveDto } from '../dto/reject-leave.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller()
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  /* ========== EMPLOYEE ========== */

  @UseGuards(JwtAuthGuard)
  @Post('employee/leaves/apply')
  apply(@Body() dto: ApplyLeaveDto) {
    return this.leavesService.apply(dto);
  }

  /* ========== ADMIN ========== */

  @UseGuards(JwtAuthGuard)
  @Get('admin/leaves')
  findAll() {
    return this.leavesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/leaves/:id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveLeaveDto,
  ) {
    return this.leavesService.approve(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/leaves/:id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectLeaveDto,
  ) {
    return this.leavesService.reject(id, dto);
  }
}