import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { Character } from '@prisma/client';

export interface CharacterRepositoryInterface
  extends BaseRepositoryInterface<Character> {
  findByCharacterName(name: string): Promise<Character>;
  create(name: string, type: number, privacy: boolean): Promise<Character>;
  // findById(id: number): Promise<Character>;
  // create(
  //   social: SocialPlatform,
  //   uuid: string,
  //   nickname: string,
  //   refreshToken: string,
  // ): Promise<User>;
  // delete(userId: number): Promise<void>;
}
