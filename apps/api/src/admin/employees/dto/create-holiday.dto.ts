import { IsDateString, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateHolidayDto {
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_optional?: boolean;
}