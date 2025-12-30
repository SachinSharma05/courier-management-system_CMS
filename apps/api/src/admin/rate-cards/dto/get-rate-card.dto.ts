import { IsNumber, IsString } from 'class-validator';

export class GetRateCardDto {
  @IsString()
  provider: string;

  @IsString()
  serviceType: string;

  @IsNumber()
  clientId?: number;
}