import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Bookmark, Question, Answer } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Question, Answer])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
