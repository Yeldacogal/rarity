import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, Question, Answer } from '../../entities';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async getUserNotifications(userId: number) {
    return this.notificationRepository.find({
      where: { userId },
      relations: ['question', 'answer'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getUnreadCount(userId: number) {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: number, userId: number) {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true },
    );
    return { success: true };
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  async createNotification(
    userId: number,
    type: NotificationType,
    message: string,
    questionId?: number,
    answerId?: number,
  ) {
    const notification = this.notificationRepository.create({
      userId,
      type,
      message,
      questionId,
      answerId,
    });

    return this.notificationRepository.save(notification);
  }

  async notifyNewAnswer(questionId: number, answererName: string) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (question) {
      await this.createNotification(
        question.authorId,
        NotificationType.NEW_ANSWER,
        `${answererName} sorunuza cevap verdi`,
        questionId,
      );
    }
  }

  async notifyNewReply(parentAnswerId: number, replierName: string) {
    const parentAnswer = await this.answerRepository.findOne({
      where: { id: parentAnswerId },
    });

    if (parentAnswer) {
      await this.createNotification(
        parentAnswer.authorId,
        NotificationType.NEW_REPLY,
        `${replierName} cevabınıza yanıt verdi`,
        parentAnswer.questionId,
        parentAnswerId,
      );
    }
  }

  async notifyVote(answerId: number, voterName: string) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
    });

    if (answer) {
      await this.createNotification(
        answer.authorId,
        NotificationType.ANSWER_VOTED,
        `${voterName} cevabınızı beğendi`,
        answer.questionId,
        answerId,
      );
    }
  }

  async deleteNotification(id: number, userId: number) {
    await this.notificationRepository.delete({ id, userId });
    return { success: true };
  }
}
