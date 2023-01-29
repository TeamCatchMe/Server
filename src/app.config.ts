import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { ApiConfigService } from '@config/services/api-config.service';
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import compression from 'compression';
import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import { AppModule } from './app.module';

export class AppConfig {
  private readonly NODE_ENV: string;
  private readonly logger = new Logger(AppConfig.name);

  constructor(
    private readonly app: NestExpressApplication,
    private readonly config: ApiConfigService,
  ) {
    this.NODE_ENV = this.config.appConfig.env;
    this.app = app;
    this.setMiddlewares();
    this.setVersion();
  }

  private setServerOption<T extends INestApplication>(app: T) {
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
  }

  private setMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(compression());
    this.app.enableCors();
  }

  private setVersion() {
    this.app.enableVersioning({
      type: VersioningType.URI,
    });
  }

  private async swagger() {
    this.setUpBasicAuth();
    this.setUpOpenAPIMiddleware();
  }

  private setUpBasicAuth() {
    this.app.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.config.swaggerAdminConfig.adminUser]:
            this.config.swaggerAdminConfig.adminPassword,
        },
      }),
    );
  }

  private setUpOpenAPIMiddleware() {
    this.app.enableCors({
      origin: '*',
      methods: 'GET,PUT,PATCH,POST,DELETE',
      optionsSuccessStatus: 200,
    });
    const swaggerCustomOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    const options = new DocumentBuilder()
      .setTitle('CATCHME API Documents')
      .setDescription('API lists')
      .setVersion('0.0.1')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT tokwn',
          in: 'header',
        },
        'Authorization',
      )
      .build();

    const document = SwaggerModule.createDocument(this.app, options);
    SwaggerModule.setup('docs', this.app, document, swaggerCustomOptions);
  }

  startLog() {
    if (this.NODE_ENV === 'production') {
      this.logger.log(`

🚀 Server on http://localhost:${this.config.appConfig.port} !
      
`);
    } else {
      this.logger.log(`

🚀 Server on port ${this.config.appConfig.port} !
            
`);
    }
  }

  async bootstrap() {
    this.setServerOption(this.app);
    await this.swagger();
    await this.app.listen(this.config.appConfig.port);
  }
}
