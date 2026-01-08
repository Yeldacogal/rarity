import { Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Tag } from './entities/tag.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { UserRole } from './common/enums/user-role.enum';

@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Subcategory) private subcategoryRepo: Repository<Subcategory>,
  ) {}

  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'RARITY Backend',
    };
  }

  @Post('seed')
  async seed() {
    const existingAdmin = await this.userRepo.findOne({ where: { email: 'admin@rarity.com' } });
    if (existingAdmin) {
      return { message: 'Seed already ran', status: 'skipped' };
    }

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await this.userRepo.save({
      name: 'Admin',
      email: 'admin@rarity.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    });

    await this.userRepo.save({
      name: 'Ayse Yilmaz',
      email: 'ayse@example.com',
      passwordHash: userPassword,
      role: UserRole.USER,
    });

    const categoryBakim = await this.categoryRepo.save({
      name: 'Bakim',
      slug: 'bakim',
      icon: 'lotion',
    });

    const categoryMakyaj = await this.categoryRepo.save({
      name: 'Makyaj',
      slug: 'makyaj',
      icon: 'lipstick',
    });

    const subcategories = [
      { name: 'Cilt Bakimi', category: 'BAKIM', categoryId: categoryBakim.id },
      { name: 'Sac Bakimi', category: 'BAKIM', categoryId: categoryBakim.id },
      { name: 'Vucut Bakimi', category: 'BAKIM', categoryId: categoryBakim.id },
      { name: 'Goz Makyaji', category: 'MAKYAJ', categoryId: categoryMakyaj.id },
      { name: 'Dudak Makyaji', category: 'MAKYAJ', categoryId: categoryMakyaj.id },
      { name: 'Yuz Makyaji', category: 'MAKYAJ', categoryId: categoryMakyaj.id },
    ];
    for (const sub of subcategories) {
      await this.subcategoryRepo.save(sub);
    }

    const tags = [
      { name: 'Kuru Cilt', category: 'BAKIM' },
      { name: 'Yagli Cilt', category: 'BAKIM' },
      { name: 'Karma Cilt', category: 'BAKIM' },
      { name: 'Akne', category: 'BAKIM' },
      { name: 'Nemlendirici', category: 'BAKIM' },
      { name: 'Gunes Koruyucu', category: 'BAKIM' },
      { name: 'Serum', category: 'BAKIM' },
      { name: 'Fondoten', category: 'MAKYAJ' },
      { name: 'Ruj', category: 'MAKYAJ' },
      { name: 'Maskara', category: 'MAKYAJ' },
      { name: 'Far', category: 'MAKYAJ' },
      { name: 'Eyeliner', category: 'MAKYAJ' },
      { name: 'Allik', category: 'MAKYAJ' },
      { name: 'Kapatici', category: 'MAKYAJ' },
    ];
    for (const tag of tags) {
      await this.tagRepo.save(tag);
    }

    return { message: 'Seed completed successfully', status: 'success' };
  }
}
