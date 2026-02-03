import { IsArray, IsNumber } from 'class-validator';

export class MarutiPrsGeoDto {
  @IsArray()
  @IsNumber({}, { each: true })
  cordinates: number[];
}