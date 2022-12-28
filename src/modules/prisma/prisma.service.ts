import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ApiConfigService } from 'src/config/services/api-config.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    if (this.apiConfigService.appConfig.env === 'development') {
      this.$on('query', (event) => {
        this.logger.verbose(event.query, event.duration);
      });
    }

    this.$on('error', (event) => {
      this.logger.verbose(event.target);
    });

    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
