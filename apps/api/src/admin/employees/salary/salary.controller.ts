import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { GenerateSalaryDto } from '../dto/generate-salary.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/employees/salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('generate')
  generate(@Body() dto: GenerateSalaryDto) {
    return this.salaryService.generate(dto);
  }
}