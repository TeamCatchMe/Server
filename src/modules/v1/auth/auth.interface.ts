import { User } from '@prisma/client';
import { SocialPlatform } from './common/auth.type';

export const AUTH_REPOSITORY = 'AUTH REPOSITORY';

export interface AuthRepositoryInterface {
  findByUuid(uuid: string): Promise<User>;
  create(social: SocialPlatform, uuid: string, nickname: string): Promise<User>;
  delete(userId: number): void;
}
