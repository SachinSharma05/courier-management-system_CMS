import { IsString, Length } from 'class-validator';

export class DtdcServiceabilityDto {
  @IsString()
  @Length(6, 6)
  origin_pincode: string;

  @IsString()
  @Length(6, 6)
  destination_pincode: string;
}