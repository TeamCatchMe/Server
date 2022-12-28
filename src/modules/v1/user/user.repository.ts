import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserRepositoryInterface } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async updateNickname(id: number, nickname: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        nickname,
      },
    });

    return user;
  }

  async findByNickname(nickname: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
  }
}
