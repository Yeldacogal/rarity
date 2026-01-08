import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.categoryEntity)
  subcategories: Subcategory[];

  @CreateDateColumn()
  createdAt: Date;
}
