import { Controller, UseGuards, Get, Post, Body } from "@nestjs/common";
import { HolidaysService } from "./holidays.service";
import { CreateHolidayDto } from "../dto/create-holiday.dto";
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  findAll() {
    return this.holidaysService.findAll();
  }

  @Post()
  create(@Body() dto: CreateHolidayDto) {
    return this.holidaysService.create(dto);
  }
}