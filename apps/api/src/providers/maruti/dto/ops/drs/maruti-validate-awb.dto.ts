import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MarutiValidateAwbDto {
  @IsArray()
  @IsString({ each: true })
  awbList: string[];

  @IsString()
  daId: string;

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
  @IsIn(['NORMAL', 'ECOM', 'HYPERLOCAL'])
  type?: 'NORMAL' | 'ECOM' | 'HYPERLOCAL';
}