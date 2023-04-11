import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CharacterGetDetailResponseDTO } from './dto/character-get-detail.res.dto';
import { CharacterGetFromMainResponseDTO } from './dto/character-get-from-main.res.dto';
import { CharactersGetLookingResponseDTO } from './dto/characters-get-looking.res.dto';
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
      },
    });
  }

  async findAllCharacterByUserId(userId: number): Promise<Character[]> {
    return await this.prisma.character.findMany({
      where: {
        user_id: userId,
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
        Activity: {
          where: {
            is_delete: false,
          },
        },
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
          catchu_rate: isNaN(catchu_rate) ? 0 : catchu_rate,
        };
        acc.push(characterInfo);
        return acc;
      }, []);

    return mainCharacters;
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
        where: { user_id: userId },
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
      where: { user_id: userId },
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
        created_at: 'asc',
      },
      where: { user_id: userId },
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
    offset: number,
    limit: number,
  ): Promise<CharactersGetLookingResponseDTO[]> {
    const characters = await this.prisma.character.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        type: true,
        level: true,
        User: { select: { id: true, nickname: true } },
        Activity: {
          select: {
            id: true,
            content: true,
            image: true,
            date: true,
          },
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    const sortedCharacters = characters.sort((a, b) => {
      const aRecentActivity = a.Activity[0];
      const bRecentActivity = b.Activity[0];

      if (!aRecentActivity || !bRecentActivity) {
        return 0;
      }

      const aDate = new Date(aRecentActivity.date);
      const bDate = new Date(bRecentActivity.date);

      return bDate.getTime() - aDate.getTime();
    });

    const result = sortedCharacters
      .filter((character) => character.Activity.length > 0)
      .map((character) => {
        const formattedActivity = {
          ...character.Activity[0],
          date: dayjs(character.Activity[0].date).format('YYYYMMDDHHmmss'),
        };

        return {
          ...character,
          Activity: formattedActivity,
        };
      });

    return result;
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
}
