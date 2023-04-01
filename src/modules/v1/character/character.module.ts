import { Logger, Module } from '@nestjs/common';
import { ActivityRepository } from '../activity/activity.repository';
import { ACTIVITY_REPOSITORY } from '../activity/interfaces/activity-repository.interface';
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
const ActivityRepositoryProvider = {
  provide: ACTIVITY_REPOSITORY,
  useClass: ActivityRepository,
};
@Module({
  controllers: [CharacterController],
  providers: [
    ClientRepositoryProvider,
    BlockRepositoryProvider,
    ActivityRepositoryProvider,
    CharacterService,
    Logger,
  ],
})
export class CharacterModule {}
