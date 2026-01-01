import { IsBoolean, IsEmail, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyAddress?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  providers?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
