import { IsBoolean, IsString, Length } from 'class-validator';

export class MarutiServiceabilityDto {
  @IsString()
  @Length(6, 6)
  fromPincode: string;

  @IsString()
  @Length(6, 6)
  toPincode: string;

  @IsBoolean()
  isCodOrder: boolean;
  
  @IsString()
  deliveryMode: string;
}
