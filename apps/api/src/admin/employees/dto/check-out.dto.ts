import { IsInt, IsDateString } from 'class-validator';

export class CheckOutDto {
  @IsInt()
  employee_id: number;

  @IsDateString()
  timestamp: string; // ISO timestamp
}