import {
  IsInt,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';

export class MarkAttendanceDto {
  @IsInt()
  employee_id: number;

  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsIn(['present', 'absent', 'half_day', 'leave'])
  status: 'present' | 'absent' | 'half_day' | 'leave';

  @IsOptional()
  @IsDateString()
  check_in?: string;

  @IsOptional()
  @IsDateString()
  check_out?: string;
}