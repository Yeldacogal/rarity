import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { TagsModule } from './modules/tags/tags.module';
import { VotesModule } from './modules/votes/votes.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: !isProduction,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASS') || 'Boklusuolsun1:',
          database: configService.get<string>('DB_NAME') || 'rarity',
          autoLoadEntities: true,
          synchronize: !isProduction,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    QuestionsModule,
    AnswersModule,
    TagsModule,
    VotesModule,
    ReportsModule,
    AdminModule,
    NotificationsModule,
    BookmarksModule,
    UploadsModule,
    CategoriesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
