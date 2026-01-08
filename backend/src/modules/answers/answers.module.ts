import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { Answer, Question, Notification } from '../../entities';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Question, Notification]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
