import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarksService } from './bookmarks.service';
import { CurrentUser } from '../../common/decorators';
import { User } from '../../entities';

@Controller('bookmarks')
@UseGuards(AuthGuard('jwt'))
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Get()
  getBookmarks(
    @CurrentUser() user: User,
    @Query('type') type?: 'questions' | 'answers',
  ) {
    return this.bookmarksService.getUserBookmarks(user.id, type);
  }

  @Post('questions/:id')
  toggleQuestionBookmark(
    @Param('id', ParseIntPipe) questionId: number,
    @CurrentUser() user: User,
  ) {
    return this.bookmarksService.toggleQuestionBookmark(questionId, user.id);
  }

  @Get('questions/:id')
  isQuestionBookmarked(
    @Param('id', ParseIntPipe) questionId: number,
    @CurrentUser() user: User,
  ) {
    return this.bookmarksService.isQuestionBookmarked(questionId, user.id);
  }

  @Post('answers/:id')
  toggleAnswerBookmark(
    @Param('id', ParseIntPipe) answerId: number,
    @CurrentUser() user: User,
  ) {
    return this.bookmarksService.toggleAnswerBookmark(answerId, user.id);
  }

  @Get('answers/:id')
  isAnswerBookmarked(
    @Param('id', ParseIntPipe) answerId: number,
    @CurrentUser() user: User,
  ) {
    return this.bookmarksService.isAnswerBookmarked(answerId, user.id);
  }
}
