import { Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Tag } from './entities/tag.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { UserRole } from './common/enums/user-role.enum';

@Controller('health')
export class HealthController {
  constructor(
    private dataSource: DataSource,
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
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      passwordHash: userPassword,
      role: UserRole.USER,
    });

    const categoryBakim = await this.categoryRepo.save({
      name: 'Bakım',
      slug: 'bakim',
      icon: '🧴',
    });

    const categoryMakyaj = await this.categoryRepo.save({
      name: 'Makyaj',
      slug: 'makyaj',
      icon: '💄',
    });

    await this.subcategoryRepo.save([
      { name: 'Cilt Bakımı', slug: 'cilt-bakimi', category: categoryBakim },
      { name: 'Saç Bakımı', slug: 'sac-bakimi', category: categoryBakim },
      { name: 'Vücut Bakımı', slug: 'vucut-bakimi', category: categoryBakim },
      { name: 'Göz Makyajı', slug: 'goz-makyaji', category: categoryMakyaj },
      { name: 'Dudak Makyajı', slug: 'dudak-makyaji', category: categoryMakyaj },
      { name: 'Yüz Makyajı', slug: 'yuz-makyaji', category: categoryMakyaj },
    ]);

    await this.tagRepo.save([
      { name: 'Kuru Cilt', slug: 'kuru-cilt', category: categoryBakim },
      { name: 'Yağlı Cilt', slug: 'yagli-cilt', category: categoryBakim },
      { name: 'Karma Cilt', slug: 'karma-cilt', category: categoryBakim },
      { name: 'Akne', slug: 'akne', category: categoryBakim },
      { name: 'Nemlendirici', slug: 'nemlendirici', category: categoryBakim },
      { name: 'Güneş Koruyucu', slug: 'gunes-koruyucu', category: categoryBakim },
      { name: 'Serum', slug: 'serum', category: categoryBakim },
      { name: 'Fondöten', slug: 'fondoten', category: categoryMakyaj },
      { name: 'Ruj', slug: 'ruj', category: categoryMakyaj },
      { name: 'Maskara', slug: 'maskara', category: categoryMakyaj },
      { name: 'Far', slug: 'far', category: categoryMakyaj },
      { name: 'Eyeliner', slug: 'eyeliner', category: categoryMakyaj },
      { name: 'Allık', slug: 'allik', category: categoryMakyaj },
      { name: 'Kapatıcı', slug: 'kapatici', category: categoryMakyaj },
    ]);

    return { message: 'Seed completed successfully', status: 'success' };
  }
}
