import { IsInt, IsDateString, IsOptional, IsIn, IsString } from 'class-validator';

export class PaySalaryDto {
  @IsInt()
  employee_id: number;

  @IsInt()
  salary_id: number;

  @IsInt()
  amount: number;

  @IsDateString()
  payment_date: string;

  @IsIn(['cash', 'bank', 'upi', 'cheque'])
  mode: 'cash' | 'bank' | 'upi' | 'cheque';

  @IsOptional()
  @IsString()
  remarks?: string;
}