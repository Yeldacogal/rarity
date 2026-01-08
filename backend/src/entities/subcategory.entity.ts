import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Category } from './category.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.subcategories, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  categoryEntity: Category;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  category: string;

  @OneToMany(() => Tag, (tag) => tag.subcategory)
  tags: Tag[];
}
