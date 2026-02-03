// dto/maruti-ecomm-label.dto.ts
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class MarutiEcommLabelDto {
  @ValidateIf(o => !o.cAwbNumber)
  @IsString()
  awbNumber?: string;

  @ValidateIf(o => !o.awbNumber)
  @IsString()
  cAwbNumber?: string;
}