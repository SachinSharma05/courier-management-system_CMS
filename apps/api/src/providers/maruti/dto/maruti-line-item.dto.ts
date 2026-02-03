import { IsNumber, IsString } from 'class-validator';

export class MarutiLineItemDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  price: number;

  @IsNumber()
  weight: number; // grams
}