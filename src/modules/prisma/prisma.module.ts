import { Global, Logger, Module } from '@nestjs/common';
import { ApiConfigService } from 'src/config/services/api-config.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, ApiConfigService, Logger],
  exports: [PrismaService],
})
export class PrismaModule {}
