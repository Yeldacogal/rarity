import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Subcategory } from './subcategory.entity';

export enum TagCategory {
  MAKYAJ = 'MAKYAJ',
  BAKIM = 'BAKIM',
}

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'BAKIM',
  })
  category: string;

  @Column({ nullable: true, type: 'int' })
  subcategoryId: number | null;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.tags, { nullable: true })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
