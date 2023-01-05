import { User } from '@prisma/client';
import { SocialPlatform } from './common/auth.type';

export const AUTH_REPOSITORY = 'AUTH REPOSITORY';

export interface AuthRepositoryInterface {
  findByUuid(uuid: string): Promise<User>;
  findByRefreshToken(refreshToken: string): Promise<User>;
  create(
    social: SocialPlatform,
    uuid: string,
    nickname: string,
    refreshToken: string,
  ): Promise<User>;
  updateRefreshToken(userId: number, refreshToken: string): Promise<User>;
  delete(userId: number): Promise<void>;
}
