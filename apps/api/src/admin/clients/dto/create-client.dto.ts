import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  /**
   * Required because users table has:
   * username NOT NULL UNIQUE
   */

  @IsEmail()
  email: string;
  /**
   * Required because users.email is NOT NULL UNIQUE
   */

  @IsString()
  @IsNotEmpty()
  password: string;
  /**
   * UI will send plain password
   * Service will hash → password_hash
   */

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

  @IsArray()
  @IsOptional()
  providers?: string[];
  /**
   * Example: ['DTDC', 'Delhivery']
   */
}