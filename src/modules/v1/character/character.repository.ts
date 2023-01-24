import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CharacterGetFromMainResponseDTO } from './dto/character-get-from-main.res.dto';
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

  async findByCharacterNameAndUserId(
    userId: number,
    name: string,
  ): Promise<Character> {
    return await this.prisma.character.findFirst({
      where: { user_id: userId, name },
    });
  }

  async findByCharacterNameAndIdAndUserId(
    userId: number,
    id: number,
    name: string,
  ): Promise<Character> {
    return await this.prisma.character.findFirst({
      where: { user_id: userId, name, id: { not: id } },
    });
  }

  async create(
    userId: number,
    name: string,
    type: number,
    is_public: boolean,
  ): Promise<Character> {
    return await this.prisma.character.create({
      data: {
        user_id: userId,
        name,
        type,
        is_public,
      },
    });
  }

  async updateCharacter(
    id: number,
    name: string,
    is_public: boolean,
  ): Promise<Character> {
    const character = await this.prisma.character.update({
      where: { id },
      data: {
        name,
        is_public,
      },
    });

    return character;
  }

  async findCharactersWithInfoByUserId(
    user_id: number,
  ): Promise<CharacterGetFromMainResponseDTO[]> {
    const characters = await this.prisma.character.findMany({
      where: {
        user_id,
      },
      include: {
        Activity: true,
      },
    });

    const result = characters.reduce(
      (acc, character) => {
        const characterInfo = {
          id: character.id,
          name: character.name,
          type: character.type,
          level: character.level,
          activity_count: character.Activity.length,
        };
        acc.character.push(characterInfo);
        acc.totalActivityCount += character.Activity.length;
        return acc;
      },
      {
        character: [],
        totalActivityCount: 0,
      },
    );

    const mainCharacters: CharacterGetFromMainResponseDTO[] =
      result.character.reduce((acc, character) => {
        const catchu_rate = Math.round(
          (character.activity_count / result.totalActivityCount) * 100,
        );

        const characterInfo = {
          ...character,
          cachu_rate: isNaN(catchu_rate) ? 0 : catchu_rate,
        };
        acc.push(characterInfo);
        return acc;
      }, []);

    return mainCharacters;
  }

  //   async delete(userId: number): Promise<void> {
  //     await this.prisma.user.delete({
  //       where: { id: userId },
  //     });
  //   }
}
