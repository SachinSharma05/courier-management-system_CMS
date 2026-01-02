import { IsInt, IsDateString } from 'class-validator';

export class CheckInDto {
  @IsInt()
  employee_id: number;

  @IsDateString()
  timestamp: string; // ISO timestamp
}