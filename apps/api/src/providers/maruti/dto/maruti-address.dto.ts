import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class MarutiAddressDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  zip: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
