import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, Answer, Question, ReportType } from '../../entities';
import { CreateReportDto } from './dto';
import { ReportStatus } from '../../common/enums';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async createAnswerReport(answerId: number, dto: CreateReportDto, userId: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const existingReport = await this.reportRepository.findOne({
      where: { answerId, reporterId: userId, status: ReportStatus.OPEN },
    });

    if (existingReport) {
      throw new ConflictException('You have already reported this answer');
    }

    const report = this.reportRepository.create({
      type: ReportType.ANSWER,
      reason: dto.reason,
      details: dto.details,
      answerId,
      reporterId: userId,
    });

    await this.reportRepository.save(report);

    return report;
  }

  async createQuestionReport(questionId: number, dto: CreateReportDto, userId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existingReport = await this.reportRepository.findOne({
      where: { questionId, reporterId: userId, status: ReportStatus.OPEN },
    });

    if (existingReport) {
      throw new ConflictException('You have already reported this question');
    }

    const report = this.reportRepository.create({
      type: ReportType.QUESTION,
      reason: dto.reason,
      details: dto.details,
      questionId,
      reporterId: userId,
    });

    await this.reportRepository.save(report);

    return report;
  }
}
