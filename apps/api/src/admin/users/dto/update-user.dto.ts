import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  role?: "client" | "super_admin";

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  company_address?: string;

  @IsOptional()
  @IsString()
  contact_person?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  providers?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}