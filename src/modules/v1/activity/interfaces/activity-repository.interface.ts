import BaseRepositoryInterface from '@common/interfaces/base-repository.interface';
import { ActivityDataForLookingDTO } from '@modules/v1/character/dto/characters-get-looking.res.dto';
import { ActivityDto } from '../dto/activity.dto';

export const ACTIVITY_REPOSITORY = 'ACTIVITY REPOSITORY';

export interface ActivityRepositoryInterface
  extends BaseRepositoryInterface<ActivityDto> {
  findByDate(userId: number, date: Date): Promise<ActivityDto[]>;
  findAllBetweenDateAndDate(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityDto[]>;
  findAllForLookingList(
    date: Date,
    id: number,
    limit: number,
  ): Promise<ActivityDataForLookingDTO[]>;
  findAllByCharacterId(characterId: number): Promise<ActivityDto[]>;
  findAllByUserId(userId: number): Promise<ActivityDto[]>;
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
