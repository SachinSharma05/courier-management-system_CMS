import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAdvanceDto {
  @IsInt()
  employee_id: number;

  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}