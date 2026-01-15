export class CalculateRateDto {
  originPin: string;
  destinationPin: string;
  weight: number;
  serviceType: 'surface' | 'express';
  paymentType: 'COD' | 'PREPAID';
  codAmount?: number;
  client_id?: number;
  provider: string;
}