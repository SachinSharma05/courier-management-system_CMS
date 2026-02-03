import {
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeoLocationDto {
  @IsArray()
  cordinates: number[];
}

class PrsAddressDto {
  @IsString()
  name: string;

  @IsString()
  mobile: string;

  @IsString()
  address1: string;

  @IsString()
  address2: string;

  @IsString()
  zip: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @ValidateNested()
  @Type(() => GeoLocationDto)
  geoLocation: GeoLocationDto;
}

class SellerInfoDto {
  @IsString()
  name: string;

  @IsString()
  mobile: string;

  @IsString()
  companyName: string;
}

export class MarutiPrsCreateDto {
  @IsArray()
  @IsString({ each: true })
  awbNumberList: string[];

  @ValidateNested()
  @Type(() => SellerInfoDto)
  sellerInfo: SellerInfoDto;

  @ValidateNested()
  @Type(() => PrsAddressDto)
  pickupInfo: PrsAddressDto;

  @ValidateNested()
  @Type(() => PrsAddressDto)
  dropInfo: PrsAddressDto;

  @IsString()
  source: string;
}