import { IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MarutiAddressDto } from './maruti-address.dto';

export class MarutiHyperlocalServiceabilityDto {
  @IsIn(['HYPERLOCAL'])
  orderType: 'HYPERLOCAL';

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  pickupAddress: MarutiAddressDto;

  @ValidateNested()
  @Type(() => MarutiAddressDto)
  shippingAddress: MarutiAddressDto;
}