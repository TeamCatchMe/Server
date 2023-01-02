import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { swaggerSetup } from '@common/libraries/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import compression from 'compression';
import { AppModule } from './app.module';
import { LoggerService } from './libraries/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
  });

  const configService = app.get(ConfigService);

  //* Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //* 서버 추가 세팅
  app.enableCors();
  app.use(compression());

  swaggerSetup(app);

  app.useGlobalFilters(new HttpExceptionFilter());

  //* 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //? 명시해둔 타입에 맞게 자동 변환
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  Logger.log(`CATCHME running on ${port} port!`, '✨');
}

bootstrap();
