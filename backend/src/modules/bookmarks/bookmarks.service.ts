import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Bookmark, Question, Answer } from '../../entities';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async getUserBookmarks(userId: number, type?: 'questions' | 'answers') {
    let whereCondition: any = { userId };
    
    if (type === 'questions') {
      whereCondition.questionId = Not(IsNull());
      whereCondition.answerId = IsNull();
    } else if (type === 'answers') {
      whereCondition.answerId = Not(IsNull());
    }

    const bookmarks = await this.bookmarkRepository.find({
      where: whereCondition,
      relations: ['question', 'question.author', 'question.tags', 'answer', 'answer.author', 'answer.question'],
      order: { createdAt: 'DESC' },
    });

    return bookmarks.map((b) => ({
      id: b.id,
      type: b.answerId ? 'answer' : 'question',
      question: b.question,
      answer: b.answer,
      bookmarkedAt: b.createdAt,
    }));
  }

  async toggleQuestionBookmark(questionId: number, userId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existing = await this.bookmarkRepository.findOne({
      where: { userId, questionId, answerId: IsNull() },
    });

    if (existing) {
      await this.bookmarkRepository.remove(existing);
      return { bookmarked: false };
    }

    const bookmark = this.bookmarkRepository.create({
      userId,
      questionId,
    });

    await this.bookmarkRepository.save(bookmark);
    return { bookmarked: true };
  }

  async toggleAnswerBookmark(answerId: number, userId: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const existing = await this.bookmarkRepository.findOne({
      where: { userId, answerId },
    });

    if (existing) {
      await this.bookmarkRepository.remove(existing);
      return { bookmarked: false };
    }

    const bookmark = this.bookmarkRepository.create({
      userId,
      answerId,
    });

    await this.bookmarkRepository.save(bookmark);
    return { bookmarked: true };
  }

  async isQuestionBookmarked(questionId: number, userId: number) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { userId, questionId, answerId: IsNull() },
    });

    return { bookmarked: !!bookmark };
  }

  async isAnswerBookmarked(answerId: number, userId: number) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { userId, answerId },
    });

    return { bookmarked: !!bookmark };
  }
}
