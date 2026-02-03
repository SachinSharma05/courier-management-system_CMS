import { IsArray, IsOptional, IsString } from 'class-validator';

export class MarutiDrsPodDto {
  @IsOptional()
  @IsString()
  delivery_remarks?: string;

  @IsArray()
  @IsString({ each: true })
  image: string[];

  @IsString()
  receiver_name: string;

  @IsString()
  receiver_phone: string;
}