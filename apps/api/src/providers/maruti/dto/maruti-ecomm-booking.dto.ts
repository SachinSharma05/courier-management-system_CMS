import {
  IsArray,
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

export class MarutiEcommBookingDto {
  @IsString()
  orderId: string;

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

  @IsNumber()
  subTotal: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  shippingAddress: MarutiAddressDto;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  billingAddress: MarutiAddressDto;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  pickupAddress: MarutiAddressDto;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  returnAddress: MarutiAddressDto;

  @IsOptional()
  @IsNumber()
  gst?: number;

  @IsIn(['AIR', 'SURFACE'])
  deliveryPromise: 'AIR' | 'SURFACE';

  @IsOptional()
  @IsIn(['RUPEES', 'PERCENTAGE'])
  discountUnit?: 'RUPEES' | 'PERCENTAGE';

  @IsOptional()
  @IsNumber()
  discount?: number;

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
