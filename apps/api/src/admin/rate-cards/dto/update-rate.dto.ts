import { IsNumber, IsString } from 'class-validator';

export class UpdateRateDto {
  @IsNumber()
  rateCardId: number;

  @IsString()
  zoneCode: string;

  @IsString()
  slabType: string;

  @IsNumber()
  rate: number;
}