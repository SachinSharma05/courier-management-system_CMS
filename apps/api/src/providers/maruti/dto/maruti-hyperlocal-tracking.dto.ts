import { IsString } from 'class-validator';

export class MarutiHyperlocalTrackingDto {
  @IsString()
  awbNumber: string;
}