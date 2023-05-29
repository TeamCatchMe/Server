import { DateUtil } from '@common/libraries/date.util';
import { Injectable } from '@nestjs/common';
import { Activity } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActivityDataForLookingDTO } from '../character/dto/characters-get-looking.res.dto';
import { ActivityDto } from './dto/activity.dto';
import { ActivityRepositoryInterface } from './interfaces/activity-repository.interface';

@Injectable()
export class ActivityRepository implements ActivityRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: number): Promise<ActivityDto> {
    return await this.prisma.activity.findFirst({
      where: {
        id,
        is_delete: false, //TODO 이후에 soft delete 처리를 위한 미들웨어를 만들던가 해야함
      },
    });
  }

  async findAll(): Promise<ActivityDto[]> {
    return await this.prisma.activity.findMany({
      where: {
        is_delete: false,
      },
    });
  }

  async findByDate(userId: number, date: Date): Promise<Activity[]> {
    return await this.prisma.activity.findMany({
      where: {
        user_id: userId,
        date: { gte: date, lt: dayjs(date).add(1, 'day').toDate() },
        is_delete: false,
      },
    });
  }

  async findAllByCharacterId(characterId: number): Promise<ActivityDto[]> {
    return await this.prisma.activity.findMany({
      where: {
        character_id: characterId,
        is_delete: false,
      },
    });
  }

  async findAllByUserId(userId: number): Promise<ActivityDto[]> {
    return await this.prisma.activity.findMany({
      where: {
        user_id: userId,
        is_delete: false,
      },
    });
  }

  async findAllBetweenDateAndDate(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityDto[]> {
    return await this.prisma.activity.findMany({
      where: {
        user_id: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        is_delete: false,
      },
    });
  }

  async findAllForLookingList(
    date: Date,
    id: number,
    limit: number,
  ): Promise<ActivityDataForLookingDTO[]> {
    const activities = await this.prisma.activity.findMany({
      select: {
        id: true,
        content: true,
        image: true,
        character_id: true,
        date: true,
        created_at: true,
      },
      where: {
        created_at: {
          lte: date,
        },
        id: { lte: id },
        is_delete: false,
        Character: { is_public: true, is_delete: false },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    const result = activities.map((activity) => {
      const date = DateUtil.toString(activity.date);
      const createdAt = DateUtil.toString(activity.created_at);
      const formattedActivity: ActivityDataForLookingDTO = {
        id: activity.id,
        content: activity.content,
        image: activity.image,
        character_id: activity.character_id,
        date,
        createdAt,
      };
      return formattedActivity;
    });
    return result;
  }

  async create(
    userId: number,
    characterId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<ActivityDto> {
    return await this.prisma.activity.create({
      data: {
        user_id: userId,
        character_id: characterId,
        content,
        image,
        date,
      },
    });
  }

  async update(
    activityId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<ActivityDto> {
    return await this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        content,
        date,
        image,
      },
    });
  }

  async delete(activityId: number): Promise<void> {
    await this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        is_delete: true,
      },
    });
  }
}
