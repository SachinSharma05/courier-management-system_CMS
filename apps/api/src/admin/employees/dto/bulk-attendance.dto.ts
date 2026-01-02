import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { MarkAttendanceDto } from './mark-attendance.dto';

export class BulkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceDto)
  records: MarkAttendanceDto[];
}