import { IsString } from 'class-validator';

export class MarutiPrsListDto {
  @IsString()
  prsNumber: string;
}