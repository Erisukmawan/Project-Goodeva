import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized: missing x-user-id header',
      });
    }
    next();
  });

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
bootstrap();
