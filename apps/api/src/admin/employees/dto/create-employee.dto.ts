import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  employee_code: string;

  @IsString()
  name: string;

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

  @IsDateString()
  joining_date: string; // YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  exit_date?: string;

  @IsIn(['monthly', 'daily', 'hourly'])
  salary_type: 'monthly' | 'daily' | 'hourly';

  @IsNumber()
  base_salary: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}