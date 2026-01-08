import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, Answer } from '../../entities';
import { ReportStatus } from '../../common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async getReports(status?: ReportStatus) {
    const where = status ? { status } : {};

    return this.reportRepository.find({
      where,
      relations: ['reporter', 'answer', 'answer.author', 'answer.question'],
      order: { createdAt: 'DESC' },
    });
  }

  async resolveReport(id: number) {
    const report = await this.reportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = ReportStatus.RESOLVED;
    await this.reportRepository.save(report);

    return report;
  }

  async deleteAnswer(id: number) {
    const answer = await this.answerRepository.findOne({
      where: { id },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    await this.answerRepository.remove(answer);

    return { message: 'Answer deleted by admin' };
  }

  async getStats() {
    const openReportsCount = await this.reportRepository.count({
      where: { status: ReportStatus.OPEN },
    });

    const totalReportsCount = await this.reportRepository.count();

    return {
      openReports: openReportsCount,
      totalReports: totalReportsCount,
    };
  }
}
