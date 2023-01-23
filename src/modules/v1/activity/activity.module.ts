import { Module, Provider } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityRepository } from './activity.repository';
import { ActivityService } from './activity.service';
import { ACTIVITY_REPOSITORY } from './interfaces/activity-repository.interface';

const ActivityRepositoryProvider: Provider = {
  provide: ACTIVITY_REPOSITORY,
  useClass: ActivityRepository,
};

@Module({
  providers: [ActivityRepositoryProvider, ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
