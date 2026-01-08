import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Answer } from './answer.entity';

@Entity('votes')
@Unique(['userId', 'answerId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  answerId: number;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Answer, (answer) => answer.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;
}
