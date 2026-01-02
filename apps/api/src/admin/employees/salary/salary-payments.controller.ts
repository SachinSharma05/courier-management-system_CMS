import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SalaryPaymentsService } from './salary-payments.service';
import { PaySalaryDto } from '../dto/pay-salary.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/salary/payments')
export class SalaryPaymentsController {
  constructor(private readonly paymentsService: SalaryPaymentsService) {}

  @Post()
  pay(@Body() dto: PaySalaryDto) {
    return this.paymentsService.pay(dto);
  }
}
