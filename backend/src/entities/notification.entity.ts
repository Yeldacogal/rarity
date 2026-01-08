import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

export enum NotificationType {
  NEW_ANSWER = 'NEW_ANSWER',
  NEW_REPLY = 'NEW_REPLY',
  ANSWER_VOTED = 'ANSWER_VOTED',
  QUESTION_REPORTED = 'QUESTION_REPORTED',
  ANSWER_REPORTED = 'ANSWER_REPORTED',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @Column({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  answerId: number;

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
