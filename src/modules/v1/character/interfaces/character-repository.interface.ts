import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { Character } from '@prisma/client';
import {
  FindAllCharactersForLookingDTO
} from '../dto/characters-get-looking.res.dto';
import { CharactersResponseDTO } from '../dto/characters.res.dto';

export const CHARACTER_REPOSITORY = 'CHARACTER REPOSITORY';

export interface CharacterRepositoryInterface
  extends BaseRepositoryInterface<Character> {
  findAllCharacterByUserId(userId: number): Promise<Character[]>;

  findManyForDailyCharacter(ids: number[]): Promise<Character[]>;

  findByCharacterNameAndUserId(
    userId: number,
    name: string,
  ): Promise<Character>;

  findByCharacterNameAndIdAndUserId(
    userId: number,
    id: number,
    name: string,
  ): Promise<Character>;

  create(
    id: number,
    name: string,
    type: number,
    is_public: boolean,
  ): Promise<Character>;

  updateCharacter(
    id: number,
    name: string,
    is_public: boolean,
  ): Promise<Character>;

  findCharactersOrderByMost(userId: number): Promise<CharactersResponseDTO[]>;
  findCharactersOrderByRecent(userId: number): Promise<CharactersResponseDTO[]>;
  findCharactersOrderByBirth(userId: number): Promise<CharactersResponseDTO[]>;

  findCharacterDetailWithId(
    characterId: number,
  ): Promise<CharactersResponseDTO>;
  getCharactersForLookingList(
    characterIds: number[],
  ): Promise<FindAllCharactersForLookingDTO[]>;

  delete(characterId: number): Promise<void>;

  updateLevel(characterId: number, level: number): Promise<void>;
}
