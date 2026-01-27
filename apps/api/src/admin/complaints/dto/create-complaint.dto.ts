import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  awb: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}