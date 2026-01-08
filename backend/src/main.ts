import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    frontendUrl,
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 RARITY Backend running on http://localhost:${port}`);
}
bootstrap();
