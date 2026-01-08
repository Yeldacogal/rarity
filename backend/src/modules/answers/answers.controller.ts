import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnswersService } from './answers.service';
import { CreateAnswerDto, UpdateAnswerDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import { BannedGuard } from '../../common/guards';
import { User } from '../../entities';

@Controller()
export class AnswersController {
  constructor(private answersService: AnswersService) {}

  @Post('questions/:questionId/answers')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  create(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.answersService.create(questionId, dto, user.id, user.name);
  }

  @Patch('answers/:id')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.answersService.update(id, dto, user.id, user.role);
  }

  @Delete('answers/:id')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.answersService.remove(id, user.id, user.role);
  }
}
