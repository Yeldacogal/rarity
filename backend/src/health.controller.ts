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

    await this.subcategoryRepo.save([
      { name: 'Cilt Bakimi', slug: 'cilt-bakimi', category: categoryBakim },
      { name: 'Sac Bakimi', slug: 'sac-bakimi', category: categoryBakim },
      { name: 'Vucut Bakimi', slug: 'vucut-bakimi', category: categoryBakim },
      { name: 'Goz Makyaji', slug: 'goz-makyaji', category: categoryMakyaj },
      { name: 'Dudak Makyaji', slug: 'dudak-makyaji', category: categoryMakyaj },
      { name: 'Yuz Makyaji', slug: 'yuz-makyaji', category: categoryMakyaj },
    ]);

    await this.tagRepo.save([
      { name: 'Kuru Cilt', slug: 'kuru-cilt', category: categoryBakim },
      { name: 'Yagli Cilt', slug: 'yagli-cilt', category: categoryBakim },
      { name: 'Karma Cilt', slug: 'karma-cilt', category: categoryBakim },
      { name: 'Akne', slug: 'akne', category: categoryBakim },
      { name: 'Nemlendirici', slug: 'nemlendirici', category: categoryBakim },
      { name: 'Gunes Koruyucu', slug: 'gunes-koruyucu', category: categoryBakim },
      { name: 'Serum', slug: 'serum', category: categoryBakim },
      { name: 'Fondoten', slug: 'fondoten', category: categoryMakyaj },
      { name: 'Ruj', slug: 'ruj', category: categoryMakyaj },
      { name: 'Maskara', slug: 'maskara', category: categoryMakyaj },
      { name: 'Far', slug: 'far', category: categoryMakyaj },
      { name: 'Eyeliner', slug: 'eyeliner', category: categoryMakyaj },
      { name: 'Allik', slug: 'allik', category: categoryMakyaj },
      { name: 'Kapatici', slug: 'kapatici', category: categoryMakyaj },
    ]);

    return { message: 'Seed completed successfully', status: 'success' };
  }
}
