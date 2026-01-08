import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  answerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Question, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Answer, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;
}
