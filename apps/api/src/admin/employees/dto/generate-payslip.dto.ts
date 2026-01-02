import { IsInt, IsString } from 'class-validator';

export class GeneratePayslipDto {
  @IsInt()
  employee_id: number;

  @IsString()
  month: string; // YYYY-MM
}