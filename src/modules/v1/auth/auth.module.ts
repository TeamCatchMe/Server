import { Logger, Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../user/interfaces/user-repository.interface';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY } from './auth.interface';
import AuthRepository from './auth.repository';
import { AuthService } from './auth.service';

const AuthRepositoryProvider = {
  provide: AUTH_REPOSITORY,
  useClass: AuthRepository,
};

const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};
@Module({
  controllers: [AuthController],
  providers: [
    AuthRepositoryProvider,
    UserRepositoryProvider,
    AuthService,
    Logger,
  ],
})
export class AuthModule {}
