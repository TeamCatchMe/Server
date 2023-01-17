import { Logger, Module } from '@nestjs/common';

import { CharacterController } from './character.controller';
import CharacterRepository from './character.repository';
import { CharacterService } from './character.service';
import { CHARACTER_REPOSITORY } from './interfaces/character-repository.interface';

const ClientRepositoryProvider = {
  provide: CHARACTER_REPOSITORY,
  useClass: CharacterRepository,
};
@Module({
  controllers: [CharacterController],
  providers: [ClientRepositoryProvider, CharacterService, Logger],
})
export class CharacterModule {}
