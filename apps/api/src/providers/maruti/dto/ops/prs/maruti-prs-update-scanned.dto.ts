import { IsArray, IsString } from 'class-validator';

export class MarutiPrsUpdateScannedDto {
  @IsString()
  deliveryAgentId: string;

  @IsString()
  prsNumber: string;

  @IsArray()
  @IsString({ each: true })
  awbNumberList: string[];
}