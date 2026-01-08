import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: { order: 'ASC', name: 'ASC' },
      relations: ['subcategories'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['subcategories', 'subcategories.tags'],
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['subcategories', 'subcategories.tags'],
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoriesRepository.findOne({
      where: [
        { name: createCategoryDto.name },
        { slug: createCategoryDto.slug },
      ],
    });

    if (existing) {
      throw new ConflictException('Bu kategori adı veya slug zaten mevcut');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const existing = await this.categoriesRepository
        .createQueryBuilder('category')
        .where('category.id != :id', { id })
        .andWhere('(category.name = :name OR category.slug = :slug)', {
          name: updateCategoryDto.name || '',
          slug: updateCategoryDto.slug || '',
        })
        .getOne();

      if (existing) {
        throw new ConflictException('Bu kategori adı veya slug zaten mevcut');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}
