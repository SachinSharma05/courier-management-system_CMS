import { IsInt, IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class ApplyLeaveDto {
  @IsInt()
  employee_id: number;

  @IsDateString()
  from_date: string; // YYYY-MM-DD

  @IsDateString()
  to_date: string;

  @IsIn(['sick', 'casual', 'paid', 'unpaid'])
  type: 'sick' | 'casual' | 'paid' | 'unpaid';

  @IsOptional()
  @IsString()
  reason?: string;
}