import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from '../dto/mark-attendance.dto';
import { BulkAttendanceDto } from '../dto/bulk-attendance.dto';
import { CheckInDto } from '../dto/check-in.dto';
import { CheckOutDto } from '../dto/check-out.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('admin/employees')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /* ================= ADMIN (MANUAL) ================= */

  @UseGuards(JwtAuthGuard)
  @Get('attendance')
  findAll() {
    return this.attendanceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('attendance/mark')
  mark(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.mark(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attendance/bulk')
  bulkMark(@Body() dto: BulkAttendanceDto) {
    return this.attendanceService.bulkMark(dto.records);
  }

  /* ================= AUTO (EMPLOYEE) ================= */

  @UseGuards(JwtAuthGuard)
  @Post('attendance/check-in')
  checkIn(@Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attendance/check-out')
  checkOut(@Body() dto: CheckOutDto) {
    return this.attendanceService.checkOut(dto);
  }
}