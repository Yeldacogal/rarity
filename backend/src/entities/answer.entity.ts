import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Vote } from './vote.entity';
import { Report } from './report.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  authorId: number;

  @Column()
  questionId: number;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.replies, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Answer;

  @OneToMany(() => Answer, (answer) => answer.parent)
  replies: Answer[];

  @OneToMany(() => Vote, (vote) => vote.answer)
  votes: Vote[];

  @OneToMany(() => Report, (report) => report.answer)
  reports: Report[];
}
