import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { ActivityDto } from '../dto/activity.dto';

export const ACTIVITY_REPOSITORY = 'ACTIVITY REPOSITORY';

export interface ActivityRepositoryInterface
  extends BaseRepositoryInterface<ActivityDto> {
  findByDate(userId: number, date: Date): Promise<ActivityDto>;
  findAllBetweenDateAndDate(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityDto[]>;
  findAllByCharacterId(characterId: number): Promise<ActivityDto[]>;
  create(
    userId: number,
    characterId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<ActivityDto>;
  update(
    activityId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<ActivityDto>;
  delete(activityId: number): Promise<void>;
}
