import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY } from './auth.interface';
import AuthRepository from './auth.repository';
import { AuthService } from './auth.service';

const AuthRepositoryProvider = {
  provide: AUTH_REPOSITORY,
  useClass: AuthRepository,
};
@Module({
  controllers: [AuthController],
  providers: [AuthRepositoryProvider, AuthService, Logger],
})
export class AuthModule {}
