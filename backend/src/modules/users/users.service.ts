import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['questions', 'answers'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const votesReceived = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.answers', 'answer')
      .leftJoin('answer.votes', 'vote')
      .where('user.id = :userId', { userId })
      .select('COUNT(vote.id)', 'count')
      .getRawOne();

    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      isBanned: user.isBanned,
      createdAt: user.createdAt,
      questionsCount: user.questions?.length || 0,
      answersCount: user.answers?.length || 0,
      votesReceived: parseInt(votesReceived?.count || '0'),
    };
  }

  async updateProfile(userId: number, dto: { name?: string; avatarUrl?: string; bio?: string }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.name) user.name = dto.name;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
    if (dto.bio !== undefined) user.bio = dto.bio;

    await this.userRepository.save(user);
    return user;
  }

  async getAllUsers() {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async banUser(userId: number, currentUserId: number) {
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot ban yourself');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBanned = !user.isBanned;
    await this.userRepository.save(user);

    return user;
  }

  async deleteUser(userId: number, currentUserId: number) {
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot delete yourself');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }
}
