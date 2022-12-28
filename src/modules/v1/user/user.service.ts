import { rm } from '@common/constants';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  UserRepositoryInterface,
  USER_REPOSITORY,
} from './interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async findUserById(userId: number) {
    const user = await this.userRepository.findById(userId);
    return user;
  }

  async findUserByNickname(nickname: string) {
    const user = await this.userRepository.findByNickname(nickname);

    if (!user) {
      throw new NotFoundException(rm.NO_USER);
    }
    return user;
  }

  async updateNickname(userId: number, nickname: string) {
    const alreadyUsedNickname = await this.userRepository.findByNickname(
      nickname,
    );

    if (alreadyUsedNickname) {
      throw new ConflictException(rm.ALREADY_USER_NAME);
    }

    const user = await this.userRepository.updateNickname(userId, nickname);
    return user;
  }

  async checkDuplicateNickname(nickname: string) {
    const alreadyUsedNickname = await this.userRepository.findByNickname(
      nickname,
    );

    if (alreadyUsedNickname) {
      throw new ConflictException(rm.ALREADY_USER_NAME);
    }

    return 1;
  }
}
