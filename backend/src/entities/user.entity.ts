import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../common/enums';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { Vote } from './vote.entity';
import { Report } from './report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (question) => question.author)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.author)
  answers: Answer[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports: Report[];
}
