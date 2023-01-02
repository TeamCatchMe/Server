import { ApiConfigService } from '@config/services/api-config.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';
import { LoggerService } from './libraries/logger.service';

async function bootstrap() {
  const nestExpressServer = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      logger: new LoggerService(),
    },
  );
  const config = nestExpressServer.get(ApiConfigService);

  const app = new AppConfig(nestExpressServer, config);
  await app.bootstrap();
  app.startLog();
}

bootstrap().catch((error) => {
  new Logger('initial').error(error);
});
