import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { Character } from '@prisma/client';

export const CHARACTER_REPOSITORY = 'CHARACTER REPOSITORY';

export interface CharacterRepositoryInterface
  extends BaseRepositoryInterface<Character> {
  findByCharacterNameAndUserId(
    userId: number,
    name: string,
  ): Promise<Character>;
  create(
    id: number,
    name: string,
    type: number,
    privacy: boolean,
  ): Promise<Character>;
  // findById(id: number): Promise<Character>;
  // create(
  //   social: SocialPlatform,
  //   uuid: string,
  //   nickname: string,
  //   refreshToken: string,
  // ): Promise<User>;
  // delete(userId: number): Promise<void>;
}
