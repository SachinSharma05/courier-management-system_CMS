import { IsString, IsOptional } from 'class-validator';

export class GenerateSalaryDto {
  @IsString()
  month: string; // YYYY-MM

  @IsOptional()
  employee_id?: number; // if missing → generate for all
}