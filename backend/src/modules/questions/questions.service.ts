import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Question, Tag } from '../../entities';
import { CreateQuestionDto, UpdateQuestionDto, UpdateQuestionTagsDto, QuestionQueryDto } from './dto';
import { UserRole } from '../../common/enums';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(query: QuestionQueryDto) {
    const { search, tags, sortBy = 'newest', page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const qb = this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.tags', 'filterTags')
      .leftJoin('question.answers', 'answers')
      .select('question.id', 'id')
      .addSelect('COUNT(DISTINCT answers.id)', 'answerCount')
      .groupBy('question.id');

    if (search) {
      qb.andWhere(
        '(question.title ILIKE :search OR question.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tags) {
      const tagIds = tags.split(',').map(Number);
      qb.andWhere('filterTags.id IN (:...tagIds)', { tagIds });
    }

    if (sortBy === 'noAnswers') {
      qb.having('COUNT(DISTINCT answers.id) = 0');
    }

    switch (sortBy) {
      case 'oldest':
        qb.orderBy('question.createdAt', 'ASC');
        break;
      case 'mostAnswers':
        qb.orderBy('"answerCount"', 'DESC')
          .addOrderBy('question.createdAt', 'DESC');
        break;
      case 'noAnswers':
        qb.orderBy('question.createdAt', 'DESC');
        break;
      case 'newest':
      default:
        qb.orderBy('question.createdAt', 'DESC');
        break;
    }

    const allResults = await qb.getRawMany();
    const total = allResults.length;

    qb.offset(skip).limit(limit);
    const paginatedResults = await qb.getRawMany();
    const questionIds = paginatedResults.map(r => r.id);

    if (questionIds.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
        },
      };
    }

    const questions = await this.questionRepository.find({
      where: { id: In(questionIds) },
      relations: ['author', 'tags'],
    });

    const answerCountMap = new Map(paginatedResults.map(r => [r.id, parseInt(r.answerCount || '0')]));
    const questionsWithCounts = questionIds.map(id => {
      const question = questions.find(q => q.id === id);
      return {
        ...question,
        answerCount: answerCountMap.get(id) || 0,
      };
    });

    return {
      data: questionsWithCounts,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['author', 'tags', 'answers', 'answers.author', 'answers.votes', 'answers.replies', 'answers.replies.author', 'answers.replies.votes'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const topLevelAnswers = question.answers
      .filter((answer) => !answer.parentId)
      .map((answer) => ({
        ...answer,
        voteCount: answer.votes?.length || 0,
        replies: answer.replies?.map((reply) => ({
          ...reply,
          voteCount: reply.votes?.length || 0,
        })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) || [],
      }));

    return {
      ...question,
      answers: topLevelAnswers.sort((a, b) => b.voteCount - a.voteCount),
    };
  }

  async create(dto: CreateQuestionDto, userId: number) {
    const question = this.questionRepository.create({
      title: dto.title,
      content: dto.content,
      imageUrl: dto.imageUrl,
      authorId: userId,
    });

    if (dto.tagIds && dto.tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(dto.tagIds) });
      question.tags = tags;
    }

    await this.questionRepository.save(question);

    return this.findOne(question.id);
  }

  async update(id: number, dto: UpdateQuestionDto, userId: number, userRole: UserRole) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.authorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own questions');
    }

    Object.assign(question, dto);
    await this.questionRepository.save(question);

    return this.findOne(id);
  }

  async updateTags(id: number, dto: UpdateQuestionTagsDto, userId: number, userRole: UserRole) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.authorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own questions');
    }

    const tags = await this.tagRepository.findBy({ id: In(dto.tagIds) });
    question.tags = tags;

    await this.questionRepository.save(question);

    return this.findOne(id);
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.authorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own questions');
    }

    await this.questionRepository.remove(question);

    return { message: 'Question deleted successfully' };
  }

  async getMyQuestions(userId: number) {
    return this.questionRepository.find({
      where: { authorId: userId },
      relations: ['tags', 'answers'],
      order: { createdAt: 'DESC' },
    });
  }
}
