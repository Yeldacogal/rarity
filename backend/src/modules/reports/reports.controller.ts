import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import { BannedGuard } from '../../common/guards';
import { User } from '../../entities';

@Controller()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('answers/:answerId/reports')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  createAnswerReport(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() dto: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.createAnswerReport(answerId, dto, user.id);
  }

  @Post('questions/:questionId/reports')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  createQuestionReport(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.createQuestionReport(questionId, dto, user.id);
  }
}
