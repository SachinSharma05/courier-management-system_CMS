import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PayslipService } from './payslip.service';
import { GeneratePayslipDto } from '../dto/generate-payslip.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/payslip')
export class PayslipController {
  constructor(private readonly payslipService: PayslipService) {}

  @Post('generate')
    async generate(
    @Body() dto: GeneratePayslipDto,
    @Res({ passthrough: true }) res: any,
    ) {
    const pdf = await this.payslipService.generate(dto);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `inline; filename="payslip-${dto.employee_id}-${dto.month}.pdf"`,
    );

    return pdf;
    }
}