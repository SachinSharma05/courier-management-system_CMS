export class CalculateRateDto {
  originPin: string;
  destinationPin: string;
  weight: number;
  paymentType: 'COD' | 'PREPAID';
  codAmount?: number;
}