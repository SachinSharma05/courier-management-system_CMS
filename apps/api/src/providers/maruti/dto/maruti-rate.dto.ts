import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class MarutiEcommRateDto {
  @IsIn(['SURFACE', 'AIR'])
  deliveryPromise: 'SURFACE' | 'AIR';

  @IsNumber()
  fromPincode: number;

  @IsNumber()
  toPincode: number;

  @IsNumber()
  weight: number; // grams

  @IsOptional()
  @IsNumber()
  length?: number; // cm

  @IsOptional()
  @IsNumber()
  width?: number; // cm

  @IsOptional()
  @IsNumber()
  height?: number; // cm

  @IsOptional()
  @IsNumber()
  volumatricWeight?: number; // grams
}