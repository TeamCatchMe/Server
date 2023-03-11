import { Injectable } from '@nestjs/common';
import { Activity } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActivityRepositoryInterface } from './interfaces/activity-repository.interface';

@Injectable()
export class ActivityRepository implements ActivityRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Activity> {
    return await this.prisma.activity.findFirst({
      where: {
        id,
        is_delete: false, //todo 이후에 soft delete 처리를 위한 미들웨어를 만들던가 해야함
      },
    });
  }
  async findAll(): Promise<Activity[]> {
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

  async findByCharacterId(characterId: number): Promise<Activity[]> {
    return await this.prisma.activity.findMany({
      where: {
        character_id: characterId,
        is_delete: false,
      },
    });
  }

  async findBetweenDateAndDate(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Activity[]> {
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

  async create(
    userId: number,
    characterId: number,
    content: string,
    date: Date,
    image?: string,
  ): Promise<Activity> {
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
  ): Promise<Activity> {
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
