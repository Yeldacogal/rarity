import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Report, Answer } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Answer])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
