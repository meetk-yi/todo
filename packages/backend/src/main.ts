import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({ origin: 'http://localhost:5173' });

  await app.listen(3000);
  console.log('Backend → http://localhost:3000');
}

bootstrap();
