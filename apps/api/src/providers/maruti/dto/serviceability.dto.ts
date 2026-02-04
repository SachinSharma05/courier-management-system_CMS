import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';

export class MarutiServiceabilityDto {
  @IsNumber()
  fromPincode: number;

  @IsNumber()
  toPincode: number;

  @IsBoolean()
  isCodOrder: boolean;
  
  @IsString()
  deliveryMode: string;
}
