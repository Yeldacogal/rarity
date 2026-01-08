import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuestionsService } from './questions.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  UpdateQuestionTagsDto,
  QuestionQueryDto,
} from './dto';
import { CurrentUser } from '../../common/decorators';
import { BannedGuard } from '../../common/guards';
import { User } from '../../entities';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  findAll(@Query() query: QuestionQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMyQuestions(@CurrentUser() user: User) {
    return this.questionsService.getMyQuestions(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  create(@Body() dto: CreateQuestionDto, @CurrentUser() user: User) {
    return this.questionsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.update(id, dto, user.id, user.role);
  }

  @Put(':id/tags')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  updateTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionTagsDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.updateTags(id, dto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.questionsService.remove(id, user.id, user.role);
  }
}
