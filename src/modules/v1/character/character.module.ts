import { Logger, Module } from '@nestjs/common';
import BlockRepository from '../block/block.repository';
import { BLOCK_REPOSITORY } from '../block/interface/block-repository.interface';

import { CharacterController } from './character.controller';
import CharacterRepository from './character.repository';
import { CharacterService } from './character.service';
import { CHARACTER_REPOSITORY } from './interfaces/character-repository.interface';

const ClientRepositoryProvider = {
  provide: CHARACTER_REPOSITORY,
  useClass: CharacterRepository,
};
const BlockRepositoryProvider = {
  provide: BLOCK_REPOSITORY,
  useClass: BlockRepository,
};
@Module({
  controllers: [CharacterController],
  providers: [
    ClientRepositoryProvider,
    BlockRepositoryProvider,
    CharacterService,
    Logger,
  ],
})
export class CharacterModule {}
