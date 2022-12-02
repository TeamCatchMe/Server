import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { JwtHandlerService } from './services/jwt-handler.service';

const providers = [ApiConfigService, AwsS3Service, ConfigService, JwtHandlerService, JwtService];

@Global()
@Module({
  providers,
  imports: [TerminusModule],
  exports: [...providers],
})
export class CommonModule {}
