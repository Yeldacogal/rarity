import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { Vote, Answer } from '../../entities';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, Answer]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
