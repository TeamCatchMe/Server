import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './interfaces/user-repository.interface';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};

@Module({
  controllers: [UserController],
  providers: [UserRepositoryProvider, UserService],
})
export class UserModule {}
