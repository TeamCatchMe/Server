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

  async getCalender(userId: number, startDate: string, endDate: string) {
    const start = dayjs(startDate, 'YYYYMMDD').toDate();
    const end = dayjs(endDate, 'YYYYMMDD').toDate();
    return await this.activityRepository.findBetweenDateAndDate(
      userId,
      start,
      end,
    );
  }

  async getSpecificDate(userId: number, date: string) {
    const target = dayjs(date, 'YYYYMMDD').toDate();
    console.log(target);
    return await this.activityRepository.findByDate(userId, target);
  }

  async createActivity(
    userId: number,
    characterId: number,
    content: string,
    date: string,
    image?: string,
  ) {
    const activityDate = dayjs(date, 'YYYYMMDD').toDate();
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

    const activityDate = dayjs(date, 'YYYYMMDD').toDate();
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
