import {
  IsBoolean,
  IsISO8601,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MarutiDrsPodDto } from './maruti-drs-pod.dto';

export class MarutiDrsUpdateDto {
  @IsString()
  cAWB_No: string;

  @IsBoolean()
  is_delivered: boolean;

  @IsString()
  location: string; // "lat,long"

  @ValidateNested()
  @Type(() => MarutiDrsPodDto)
  pod: MarutiDrsPodDto;

  @IsISO8601()
  status_timestamp: string;
}