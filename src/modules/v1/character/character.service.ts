import { rm } from '@common/constants';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  BlockRepositoryInterface,
  BLOCK_REPOSITORY,
} from '../block/interface/block-repository.interface';
import { CharactersResponseDTO } from './dto/characters.res.dto';

import {
  CharacterRepositoryInterface,
  CHARACTER_REPOSITORY,
} from './interfaces/character-repository.interface';
import { SortType } from './interfaces/sort-type';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private readonly characterRepository: CharacterRepositoryInterface,
    @Inject(BLOCK_REPOSITORY)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}

  async createCharacter(
    userId: number,
    name: string,
    type: number,
    is_public: boolean,
  ) {
    const alreadyUsedCharacterName =
      await this.characterRepository.findByCharacterNameAndUserId(userId, name);

    if (alreadyUsedCharacterName) {
      throw new ConflictException(rm.ALREADY_CHARACTER_NAME);
    }

    const character = await this.characterRepository.create(
      userId,
      name,
      type,
      is_public,
    );
    return character;
  }

  async editCharacter(
    userId: number,
    id: number,
    name: string,
    is_public: boolean,
  ) {
    const alreadyUsedCharacterName =
      await this.characterRepository.findByCharacterNameAndIdAndUserId(
        userId,
        id,
        name,
      );

    if (alreadyUsedCharacterName) {
      throw new ConflictException(rm.ALREADY_CHARACTER_NAME);
    }

    const character = await this.characterRepository.updateCharacter(
      id,
      name,
      is_public,
    );

    return character;
  }

  async blockCharacter(userId: number, characterId: number) {
    const existCharacter = await this.characterRepository.findById(characterId);

    if (!existCharacter) {
      throw new ConflictException(rm.NO_CHARACTER_ID);
    }

    const alreadyBlockedCharacter =
      await this.blockRepository.findByUserIdAndTargetId(userId, characterId);

    if (alreadyBlockedCharacter.length) {
      throw new ConflictException(rm.ALREADY_BLOCKED_CHARACTER);
    }

    const blockCharacter = await this.blockRepository.block(
      userId,
      characterId,
    );

    return blockCharacter;
  }

  async getCharactersFromMain(userId: number) {
    const existCharacter =
      await this.characterRepository.findCharactersWithInfoByUserId(userId);

    return existCharacter;
  }

  async getCharacters(userId: number, sort: SortType) {
    let characters: CharactersResponseDTO[];

    switch (sort) {
      case 'recent':
        characters = await this.characterRepository.findCharactersOrderByRecent(
          userId,
        );
        break;
      case 'most':
        characters = await this.characterRepository.findCharactersOrderByMost(
          userId,
        );
        break;
      default:
        characters = await this.characterRepository.findCharactersOrderByBirth(
          userId,
        );
        break;
    }

    return characters;
  }
}
