import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../user/interfaces/user-repository.interface';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY } from './auth.interface';
import AuthRepository from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

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
    JwtStrategy,
  ],
})
export class AuthModule {}
