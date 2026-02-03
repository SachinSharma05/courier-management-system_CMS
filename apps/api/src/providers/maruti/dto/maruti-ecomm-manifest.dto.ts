import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class MarutiEcommManifestDto {
  @ValidateIf(o => !o.cAwbNumber)
  @IsString()
  awbNumber?: string;

  @ValidateIf(o => !o.awbNumber)
  @IsString()
  cAwbNumber?: string;
}