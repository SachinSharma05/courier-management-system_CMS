import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MarutiCreateDrsDto {
  @IsArray()
  @IsString({ each: true })
  awbList: string[]; // mandatory

  @IsString()
  daId: string; // mandatory (delivery agent id)

  @IsOptional()
  @IsString()
  daMobileNo?: string;

  @IsOptional()
  @IsString()
  deliveryArea?: string;

  @IsOptional()
  @IsNumber()
  deliveryPincode?: number;

  @IsOptional()
  @IsIn(['ECOM', 'HYPERLOCAL'])
  type?: 'ECOM' | 'HYPERLOCAL';
}