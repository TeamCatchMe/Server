import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { User } from '@prisma/client';

export const USER_REPOSITORY = 'USER REPOSITORY';

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
  findByNickname(nickname: string): Promise<User>;
  updateNickname(id: number, nickname: string): Promise<User>;
}
