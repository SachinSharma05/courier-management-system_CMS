import { IsString } from 'class-validator';

export class MarutiPrsUpdateStatusDto {
  @IsString()
  prsNumber: string;

  @IsString()
  status: string; // keep flexible, Maruti controls enum
}