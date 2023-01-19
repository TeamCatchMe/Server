import { rm } from '@common/constants';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CharacterRepositoryInterface,
  CHARACTER_REPOSITORY,
} from './interfaces/character-repository.interface';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private readonly characterRepository: CharacterRepositoryInterface,
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
}
