import { rm } from '@common/constants';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CharacterRepositoryInterface } from './interfaces/character-repository.interface';

@Injectable()
export class CharacterService {
  constructor(
    @Inject()
    private readonly characterRepository: CharacterRepositoryInterface,
  ) {}

  async createCharacter(name: string, type: number, privacy: boolean) {
    const alreadyUsedCharacterName =
      await this.characterRepository.findByCharacterName(name);

    if (alreadyUsedCharacterName) {
      throw new ConflictException(rm.ALREADY_CHARACTER_NAME);
    }

    const character = await this.characterRepository.create(
      name,
      type,
      privacy,
    );
    return character;
  }
}
