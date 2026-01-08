import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ReportReason } from '../../../common/enums';

export class CreateReportDto {
  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsString()
  @IsOptional()
  details?: string;
}
