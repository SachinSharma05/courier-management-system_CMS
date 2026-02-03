import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MarutiPrsGeoDto } from './maruti-prs-geo.dto';

export class MarutiPrsAddressDto {
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
  @Type(() => MarutiPrsGeoDto)
  geoLocation: MarutiPrsGeoDto;
}