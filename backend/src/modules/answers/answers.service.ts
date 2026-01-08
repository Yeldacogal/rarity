import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer, Question, User } from '../../entities';
import { CreateAnswerDto, UpdateAnswerDto } from './dto';
import { UserRole } from '../../common/enums';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(questionId: number, dto: CreateAnswerDto, userId: number, userName: string) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (dto.parentId) {
      const parentAnswer = await this.answerRepository.findOne({
        where: { id: dto.parentId, questionId },
      });

      if (!parentAnswer) {
        throw new NotFoundException('Parent answer not found');
      }
    }

    const answer = this.answerRepository.create({
      content: dto.content,
      imageUrl: dto.imageUrl,
      authorId: userId,
      questionId,
      parentId: dto.parentId || undefined,
    });

    await this.answerRepository.save(answer);

    if (question.authorId !== userId) {
      await this.notificationsService.notifyNewAnswer(questionId, userName);
    }

    if (dto.parentId) {
      const parentAnswer = await this.answerRepository.findOne({
        where: { id: dto.parentId },
      });
      if (parentAnswer && parentAnswer.authorId !== userId) {
        await this.notificationsService.notifyNewReply(dto.parentId, userName);
      }
    }

    return this.answerRepository.findOne({
      where: { id: answer.id },
      relations: ['author', 'votes'],
    });
  }

  async update(id: number, dto: UpdateAnswerDto, userId: number, userRole: UserRole) {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.authorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own answers');
    }

    Object.assign(answer, dto);
    await this.answerRepository.save(answer);

    return this.answerRepository.findOne({
      where: { id },
      relations: ['author', 'votes'],
    });
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const answer = await this.answerRepository.findOne({
      where: { id },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.authorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own answers');
    }

    await this.answerRepository.remove(answer);

    return { message: 'Answer deleted successfully' };
  }

  async findOne(id: number) {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['author', 'votes', 'question'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return answer;
  }
}
