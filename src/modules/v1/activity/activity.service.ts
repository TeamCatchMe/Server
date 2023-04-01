import { rm } from '@common/constants';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { ActivityResponseDTO } from './dto/activity.res.dto';
import {
  ActivityRepositoryInterface,
  ACTIVITY_REPOSITORY,
} from './interfaces/activity-repository.interface';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryInterface,
  ) {}

  async getActivitiesByCharacterId(characterId: number) {
    const activities = await this.activityRepository.findAllByCharacterId(
      characterId,
    );
    return activities.map((activity) => new ActivityResponseDTO(activity));
  }

  async createActivity(
    userId: number,
    characterId: number,
    content: string,
    date: string,
    image?: string,
  ) {
    const activityDate = dayjs(date, 'YYYYMMDD').add(9, 'h').toDate();
    const activity = await this.activityRepository.create(
      userId,
      characterId,
      content,
      activityDate,
      image ? image : null,
    );

    return new ActivityResponseDTO(activity);
  }

  async updateActivity(
    userId: number,
    activityId: number,
    content: string,
    date: string,
    image?: string,
  ) {
    const activity = await this.activityRepository.findById(activityId);
    if (!activity) throw new NotFoundException(rm.NO_ACTIVITY_ID);

    if (activity.user_id !== userId)
      throw new ConflictException(rm.UNAUTHORIZED);

    const activityDate = dayjs(date, 'YYYYMMDD').add(9, 'h').toDate();
    const updatedActivity = await this.activityRepository.update(
      activityId,
      content,
      activityDate,
      image ? image : null,
    );

    return new ActivityResponseDTO(updatedActivity);
  }

  async deleteActivity(userId: number, activityId: number) {
    const activity = await this.activityRepository.findById(activityId);
    if (!activity) throw new NotFoundException(rm.NO_ACTIVITY_ID);

    if (activity.user_id !== userId)
      throw new ConflictException(rm.UNAUTHORIZED);

    await this.activityRepository.delete(activityId);
  }
}
