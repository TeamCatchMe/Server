import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY } from './auth.interface';
import AuthRepository from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, { useClass: AuthRepository, provide: AUTH_REPOSITORY }],
})
export class AuthModule {}
