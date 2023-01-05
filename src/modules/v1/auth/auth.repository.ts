import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthRepositoryInterface } from './auth.interface';
import { SocialPlatform } from './common/auth.type';

@Injectable()
export default class AuthRepository implements AuthRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findByRefreshToken(refreshToken: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { refresh_token: refreshToken },
    });
  }

  async findByUuid(uuid: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async create(
    provider: SocialPlatform,
    uuid: string,
    nickname: string,
    refreshToken: string,
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        provider,
        uuid,
        nickname,
        refresh_token: refreshToken,
      },
    });
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
