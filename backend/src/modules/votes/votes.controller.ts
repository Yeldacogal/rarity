import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VotesService } from './votes.service';
import { CurrentUser } from '../../common/decorators';
import { BannedGuard } from '../../common/guards';
import { User } from '../../entities';

@Controller('answers/:answerId/votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), BannedGuard)
  toggleVote(
    @Param('answerId', ParseIntPipe) answerId: number,
    @CurrentUser() user: User,
  ) {
    return this.votesService.toggleVote(answerId, user.id, user.name);
  }

  @Get('count')
  getVoteCount(@Param('answerId', ParseIntPipe) answerId: number) {
    return this.votesService.getVoteCount(answerId);
  }

  @Get('check')
  @UseGuards(AuthGuard('jwt'))
  hasUserVoted(
    @Param('answerId', ParseIntPipe) answerId: number,
    @CurrentUser() user: User,
  ) {
    return this.votesService.hasUserVoted(answerId, user.id);
  }
}
