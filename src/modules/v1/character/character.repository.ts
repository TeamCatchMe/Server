import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CharacterGetDetailResponseDTO } from './dto/character-get-detail.res.dto';
import {
  FindAllCharactersForLookingDTO
} from './dto/characters-get-looking.res.dto';
import { CharactersResponseDTO } from './dto/characters.res.dto';
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

  async findManyForDailyCharacter(ids: number[]): Promise<Character[]> {
    return await this.prisma.character.findMany({
      where: {
        id: { in: ids },
        is_delete: false,
      },
    });
  }

  async findAllCharacterByUserId(userId: number): Promise<Character[]> {
    return await this.prisma.character.findMany({
      where: {
        user_id: userId,
        is_delete: false,
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
      where: { user_id: userId, name, is_delete: false },
    });
  }

  async findByCharacterNameAndIdAndUserId(
    userId: number,
    id: number,
    name: string,
  ): Promise<Character> {
    return await this.prisma.character.findFirst({
      where: { user_id: userId, name, id: { not: id }, is_delete: false },
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

  async findCharactersOrderByMost(
    userId: number,
  ): Promise<CharactersResponseDTO[]> {
    const charactersOrderedByActivityCount =
      await this.prisma.character.findMany({
        include: {
          Activity: true,
        },
        orderBy: {
          Activity: {
            _count: 'desc',
          },
        },
        where: { user_id: userId, is_delete: false },
      });

    const characters: CharactersResponseDTO[] = [];
    charactersOrderedByActivityCount.map((character) => {
      characters.push({
        id: character.id,
        name: character.name,
        type: character.type,
        level: character.level,
      });
    });
    return characters;
  }

  async findCharactersOrderByRecent(
    userId: number,
  ): Promise<CharactersResponseDTO[]> {
    const charactersWithActivities = await this.prisma.character.findMany({
      include: {
        Activity: {
          select: {
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
      where: { user_id: userId, is_delete: false },
    });

    const charactersOrderedByRecent = charactersWithActivities.sort(
      (a, b) =>
        new Date(b?.Activity[0]?.created_at).getTime() -
        new Date(a?.Activity[0]?.created_at).getTime(),
    );

    const characters: CharactersResponseDTO[] = [];
    charactersOrderedByRecent.map((character) => {
      characters.push({
        id: character.id,
        name: character.name,
        type: character.type,
        level: character.level,
      });
    });

    return characters;
  }

  async findCharactersOrderByBirth(
    userId: number,
  ): Promise<CharactersResponseDTO[]> {
    const characters = await this.prisma.character.findMany({
      select: { id: true, name: true, type: true, level: true },
      orderBy: {
        created_at: 'desc',
      },
      where: { user_id: userId, is_delete: false },
    });
    return characters;
  }

  async findCharacterDetailWithId(
    characterId: number,
  ): Promise<CharacterGetDetailResponseDTO> {
    const character = await this.prisma.character.findFirst({
      select: {
        id: true,
        name: true,
        type: true,
        level: true,
        is_public: true,
        user_id: true,
        created_at: true,
      },
      where: {
        id: characterId,
        is_delete: false,
      },
    });

    const characterActivityCount = await this.prisma.activity.count({
      where: {
        character_id: character.id,
        is_delete: false,
      },
    });

    const userActivityCount = await this.prisma.activity.count({
      where: {
        is_delete: false,
        Character: {
          user_id: character.user_id,
        },
      },
    });

    const catchu_rate = Math.round(
      (characterActivityCount / userActivityCount) * 100,
    );

    const characterDetail = {
      id: character.id,
      name: character.name,
      type: character.type,
      level: character.level,
      is_public: character.is_public,
      created_at: character.created_at,
      activity_count: characterActivityCount,
      catchu_rate: isNaN(catchu_rate) ? 0 : catchu_rate,
    };

    return characterDetail;
  }

  async getCharactersForLookingList(
    characterIds: number[],
  ): Promise<FindAllCharactersForLookingDTO[]> {
    const characters = await this.prisma.character.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        level: true,
        User: { select: { id: true, nickname: true } },
      },
      where: {
        id: {
          in: characterIds,
        },
        is_public: true,
        is_delete: false,
      },
    });

    return characters;
  }

  async delete(characterId: number): Promise<void> {
    await this.prisma.character.update({
      where: {
        id: characterId,
      },
      data: {
        is_delete: true,
        Activity: {
          updateMany: {
            where: {
              is_delete: false,
            },
            data: {
              is_delete: true,
            },
          },
        },
      },
    });
  }

  async updateLevel(characterId: number, level: number): Promise<void> {
    await this.prisma.character.update({
      where: {
        id: characterId
      },
      data: {
        level
      }
    });
  }
}
