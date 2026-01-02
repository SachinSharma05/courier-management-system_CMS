import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsIn,
  IsNumber,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  employee_code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsDateString()
  joining_date?: string;

  @IsOptional()
  @IsDateString()
  exit_date?: string;

  @IsOptional()
  @IsIn(['monthly', 'daily', 'hourly'])
  salary_type?: 'monthly' | 'daily' | 'hourly';

  @IsOptional()
  @IsNumber()
  base_salary?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}