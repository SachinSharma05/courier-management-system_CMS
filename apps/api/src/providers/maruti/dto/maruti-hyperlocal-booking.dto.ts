import {
  IsArray,
  IsBoolean,
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MarutiLineItemDto } from './maruti-line-item.dto';
import { MarutiAddressDto } from './maruti-address.dto';

export class MarutiHyperlocalBookingDto {
  @IsString()
  orderId: string;

  @IsString()
  orderNumber: string;

  @IsIn(['FORWARD', 'RTO'])
  orderSubtype: 'FORWARD' | 'RTO';

  @IsISO8601()
  orderCreatedAt: string;

  @IsString()
  currency: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  weight: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarutiLineItemDto)
  lineItems: MarutiLineItemDto[];

  @IsIn(['COD', 'PREPAID'])
  paymentType: 'COD' | 'PREPAID';

  @IsIn(['PENDING', 'PAID'])
  paymentStatus: 'PENDING' | 'PAID';

  @IsOptional()
  @IsString()
  remarks?: string;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  shippingAddress: MarutiAddressDto;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  pickupAddress: MarutiAddressDto;

  @IsIn([
    '90_MIN_DELIVERY',
    '60_MIN_DELIVERY',
    '120_MIN_DELIVERY',
  ])
  deliveryPromise:
    | '60_MIN_DELIVERY'
    | '90_MIN_DELIVERY'
    | '120_MIN_DELIVERY';

  @IsBoolean()
  returnableOrder: boolean;

  @IsString()
  channelCode: string;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}