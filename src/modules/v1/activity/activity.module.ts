import { Module, Provider } from '@nestjs/common';
import BlockRepository from '../block/block.repository';
import { BLOCK_REPOSITORY } from '../block/interface/block-repository.interface';
import CharacterRepository from '../character/character.repository';
import { CharacterService } from '../character/character.service';
import { CHARACTER_REPOSITORY } from '../character/interfaces/character-repository.interface';
import { ActivityController } from './activity.controller';
import { ActivityRepository } from './activity.repository';
import { ActivityService } from './activity.service';
import { ACTIVITY_REPOSITORY } from './interfaces/activity-repository.interface';

const ActivityRepositoryProvider: Provider = {
  provide: ACTIVITY_REPOSITORY,
  useClass: ActivityRepository,
};

const ChracterRepositoryProvider: Provider = {
  provide: CHARACTER_REPOSITORY,
  useClass: CharacterRepository
}
const BlockRepositoryProvider: Provider = {
  provide: BLOCK_REPOSITORY,
  useClass: BlockRepository,
};

@Module({
  providers: [ActivityRepositoryProvider, ActivityService, ChracterRepositoryProvider, CharacterService, BlockRepositoryProvider],
  controllers: [ActivityController],
})
export class ActivityModule {}
