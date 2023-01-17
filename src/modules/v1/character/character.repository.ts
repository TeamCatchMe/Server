import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CharacterRepositoryInterface } from './interfaces/character-repository.interface';

@Injectable()
export default class CharacterRepository
  implements CharacterRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Character> {
    return await this.prisma.character.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Character[]> {
    return await this.prisma.character.findMany();
  }

  async findByCharacterName(): Promise<Character> {
    // return await this.prisma.character.findMany();
    return;
  }

  async create(
    userId: number,
    name: string,
    type: number,
    privacy: boolean,
  ): Promise<Character> {
    return await this.prisma.character.create({
      data: {
        user_id: userId,
        name,
        type,
        is_public: privacy,
      },
    });
  }

  //   async delete(userId: number): Promise<void> {
  //     await this.prisma.user.delete({
  //       where: { id: userId },
  //     });
  //   }
}
