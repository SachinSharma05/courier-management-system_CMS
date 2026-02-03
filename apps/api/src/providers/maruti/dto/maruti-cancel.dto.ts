import { IsString } from 'class-validator';

export class MarutiCancelOrderDto {
  @IsString()
  orderId: string;

  @IsString()
  cancelReason: string;
}