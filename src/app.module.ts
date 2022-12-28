import { CommonModule } from '@config/common.module';
import { ConfigurationModule } from '@config/config.module';
import { V1Module } from '@modules/v1/v1.module';
import { Module } from '@nestjs/common';

import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [ConfigurationModule, PrismaModule, CommonModule, V1Module],
})
export class AppModule {}
