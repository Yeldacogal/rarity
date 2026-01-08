import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote, Answer } from '../../entities';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async toggleVote(answerId: number, userId: number, userName: string) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const existingVote = await this.voteRepository.findOne({
      where: { answerId, userId },
    });

    if (existingVote) {
      await this.voteRepository.remove(existingVote);
      return { voted: false, message: 'Vote removed' };
    }

    const vote = this.voteRepository.create({
      answerId,
      userId,
    });

    await this.voteRepository.save(vote);

    if (answer.authorId !== userId) {
      await this.notificationsService.notifyVote(answerId, userName);
    }

    return { voted: true, message: 'Vote added' };
  }

  async getVoteCount(answerId: number) {
    const count = await this.voteRepository.count({
      where: { answerId },
    });

    return { count };
  }

  async hasUserVoted(answerId: number, userId: number) {
    const vote = await this.voteRepository.findOne({
      where: { answerId, userId },
    });

    return { voted: !!vote };
  }
}
