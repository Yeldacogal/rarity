import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReportReason, ReportStatus } from '../common/enums';
import { User } from './user.entity';
import { Answer } from './answer.entity';
import { Question } from './question.entity';

export enum ReportType {
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.ANSWER,
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportReason,
  })
  reason: ReportReason;

  @Column({ nullable: true })
  details: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.OPEN,
  })
  status: ReportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  reporterId: number;

  @Column({ nullable: true })
  answerId: number;

  @Column({ nullable: true })
  questionId: number;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => Answer, (answer) => answer.reports, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

  @ManyToOne(() => Question, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
