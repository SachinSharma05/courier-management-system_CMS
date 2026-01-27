import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateComplaintStatusDto {
  @IsIn(['open', 'in_progress', 'resolved'])
  status: 'open' | 'in_progress' | 'resolved';

  @IsOptional()
  @IsString()
  resolution_comment?: string;
}