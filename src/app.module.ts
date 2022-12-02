import { Module } from '@nestjs/common';
import { CommonModule } from './config/common.module';
import { ConfigurationModule } from './config/config.module';

@Module({
  imports: [ConfigurationModule, CommonModule],
})
export class AppModule {}
