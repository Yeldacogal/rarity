import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag, Subcategory } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Subcategory])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
