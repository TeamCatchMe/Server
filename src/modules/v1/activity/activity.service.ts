import { rm } from '@common/constants';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
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

  async getSpecificDate(userId: number, date: string) {
    const target = dayjs(date, 'YYYYMMDD').add(9, 'h').toDate();
    return await this.activityRepository.findByDate(userId, target);
  }

  async getActivitiesByCharacterId(characterId: number) {
    return await this.activityRepository.findByCharacterId(characterId);
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

    return activity;
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
    return await this.activityRepository.update(
      activityId,
      content,
      activityDate,
      image ? image : null,
    );
  }

  async deleteActivity(userId: number, activityId: number) {
    const activity = await this.activityRepository.findById(activityId);
    if (!activity) throw new NotFoundException(rm.NO_ACTIVITY_ID);

    if (activity.user_id !== userId)
      throw new ConflictException(rm.UNAUTHORIZED);

    await this.activityRepository.delete(activityId);
  }
}
