import { IsString } from 'class-validator';

export class MarutiPrsPersonDto {
  @IsString()
  name: string;

  @IsString()
  mobile: string;
}