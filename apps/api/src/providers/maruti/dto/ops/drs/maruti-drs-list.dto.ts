import { IsString } from 'class-validator';

export class MarutiDrsListDto {
  @IsString()
  daId: string;
}