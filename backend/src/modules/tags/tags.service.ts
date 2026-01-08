import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag, Subcategory } from '../../entities';
import { CreateTagDto, UpdateTagDto, CreateSubcategoryDto, UpdateSubcategoryDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  async findAllSubcategories() {
    return this.subcategoryRepository.find({
      relations: ['tags'],
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findSubcategoriesByCategory(category: string) {
    return this.subcategoryRepository.find({
      where: { category },
      relations: ['tags'],
      order: { name: 'ASC' },
    });
  }

  async findOneSubcategory(id: number) {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory;
  }

  async createSubcategory(dto: CreateSubcategoryDto) {
    const existingSubcategory = await this.subcategoryRepository.findOne({
      where: { name: dto.name, category: dto.category },
    });

    if (existingSubcategory) {
      throw new ConflictException('Subcategory already exists in this category');
    }

    const subcategory = this.subcategoryRepository.create(dto);
    return this.subcategoryRepository.save(subcategory);
  }

  async updateSubcategory(id: number, dto: UpdateSubcategoryDto) {
    const subcategory = await this.findOneSubcategory(id);

    if (dto.name || dto.category) {
      const existingSubcategory = await this.subcategoryRepository.findOne({
        where: { 
          name: dto.name || subcategory.name, 
          category: dto.category || subcategory.category 
        },
      });

      if (existingSubcategory && existingSubcategory.id !== id) {
        throw new ConflictException('Subcategory name already exists in this category');
      }
    }

    Object.assign(subcategory, dto);
    return this.subcategoryRepository.save(subcategory);
  }

  async removeSubcategory(id: number) {
    const subcategory = await this.findOneSubcategory(id);
    
    await this.tagRepository.update(
      { subcategoryId: id },
      { subcategoryId: null }
    );
    
    await this.subcategoryRepository.remove(subcategory);
    return { message: 'Subcategory deleted successfully' };
  }

  async findAll() {
    return this.tagRepository.find({
      relations: ['subcategory'],
      order: { name: 'ASC' },
    });
  }

  async findBySubcategory(subcategoryId: number) {
    return this.tagRepository.find({
      where: { subcategoryId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['subcategory'],
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async create(dto: CreateTagDto) {
    const existingTag = await this.tagRepository.findOne({
      where: { name: dto.name },
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }

    if (dto.subcategoryId) {
      await this.findOneSubcategory(dto.subcategoryId);
    }

    const tag = this.tagRepository.create(dto);
    return this.tagRepository.save(tag);
  }

  async update(id: number, dto: UpdateTagDto) {
    const tag = await this.findOne(id);

    if (dto.name) {
      const existingTag = await this.tagRepository.findOne({
        where: { name: dto.name },
      });

      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('Tag name already exists');
      }
    }

    if (dto.subcategoryId) {
      await this.findOneSubcategory(dto.subcategoryId);
    }

    Object.assign(tag, dto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
    return { message: 'Tag deleted successfully' };
  }

  async findByIds(ids: number[]) {
    return this.tagRepository.findByIds(ids);
  }
}
