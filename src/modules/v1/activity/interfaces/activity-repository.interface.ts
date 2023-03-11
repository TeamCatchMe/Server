import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { Activity } from '@prisma/client';

export const ACTIVITY_REPOSITORY = 'ACTIVITY REPOSITORY';

export interface ActivityRepositoryInterface
  extends BaseRepositoryInterface<Activity> {
  findByDate(userId: number, date: Date): Promise<Activity[]>;
  findBetweenDateAndDate(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Activity[]>;
  findByCharacterId(characterId: number): Promise<Activity[]>;
  create(
    userId: number,
    characterId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<Activity>;
  update(
    activityId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<Activity>;
  delete(activityId: number): Promise<void>;
}
