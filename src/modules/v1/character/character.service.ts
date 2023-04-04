import { rm } from '@common/constants';
import { DateUtil } from '@common/libraries/date.util';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';
import {
  ActivityRepositoryInterface,
  ACTIVITY_REPOSITORY,
} from '../activity/interfaces/activity-repository.interface';
import {
  BlockRepositoryInterface,
  BLOCK_REPOSITORY,
} from '../block/interface/block-repository.interface';
import { DailyCharacterDataForCalenderResponseDTO } from './dto/character-get-calender.res.dto';
import { CharactersResponseDTO } from './dto/characters.res.dto';
import {
  CharacterRepositoryInterface,
  CHARACTER_REPOSITORY,
} from './interfaces/character-repository.interface';
import { SortType } from './interfaces/sort-type';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private readonly characterRepository: CharacterRepositoryInterface,
    @Inject(BLOCK_REPOSITORY)
    private readonly blockRepository: BlockRepositoryInterface,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryInterface,
  ) {}

  async createCharacter(
    userId: number,
    name: string,
    type: number,
    is_public: boolean,
  ) {
    const alreadyUsedCharacterName =
      await this.characterRepository.findByCharacterNameAndUserId(userId, name);

    if (alreadyUsedCharacterName) {
      throw new ConflictException(rm.ALREADY_CHARACTER_NAME);
    }

    const character = await this.characterRepository.create(
      userId,
      name,
      type,
      is_public,
    );
    return character;
  }

  async editCharacter(
    userId: number,
    id: number,
    name: string,
    is_public: boolean,
  ) {
    const alreadyUsedCharacterName =
      await this.characterRepository.findByCharacterNameAndIdAndUserId(
        userId,
        id,
        name,
      );

    if (alreadyUsedCharacterName) {
      throw new ConflictException(rm.ALREADY_CHARACTER_NAME);
    }

    const character = await this.characterRepository.updateCharacter(
      id,
      name,
      is_public,
    );

    return character;
  }

  async blockCharacter(userId: number, characterId: number) {
    const existCharacter = await this.characterRepository.findById(characterId);

    if (!existCharacter) {
      throw new ConflictException(rm.NO_CHARACTER_ID);
    }

    const alreadyBlockedCharacter =
      await this.blockRepository.findByUserIdAndTargetId(userId, characterId);

    if (alreadyBlockedCharacter.length) {
      throw new ConflictException(rm.ALREADY_BLOCKED_CHARACTER);
    }

    const blockCharacter = await this.blockRepository.block(
      userId,
      characterId,
    );

    return blockCharacter;
  }

  async getCharactersFromMain(userId: number) {
    const existCharacter =
      await this.characterRepository.findCharactersWithInfoByUserId(userId);

    return existCharacter;
  }

  async getCharacters(userId: number, sort: SortType) {
    let characters: CharactersResponseDTO[];

    switch (sort) {
      case 'recent':
        characters = await this.characterRepository.findCharactersOrderByRecent(
          userId,
        );
        break;
      case 'most':
        characters = await this.characterRepository.findCharactersOrderByMost(
          userId,
        );
        break;
      default:
        characters = await this.characterRepository.findCharactersOrderByBirth(
          userId,
        );
        break;
    }

    return characters;
  }

  async getCharacterDetail(characterId: number) {
    const character = await this.characterRepository.findCharacterDetailWithId(
      characterId,
    );

    return character;
  }

  async getCharactersForLookingList(offset: number) {
    let limit = 10;
    if (!offset) {
      offset = 0;
      limit = 100;
    }
    const character =
      await this.characterRepository.getCharactersForLookingList(offset, limit);

    return character;
  }

  async deleteCharacter(userId: number, characterId: number): Promise<void> {
    const character = await this.characterRepository.findById(characterId);

    if (userId !== character.user_id) {
      throw new ConflictException(rm.NO_ACCESS_DELETE_CHARACTER);
    }

    await this.characterRepository.delete(characterId);
  }

  async getCalender(userId: number, startDate: string, endDate: string) {
    const start = DateUtil.toDate(startDate);
    const end = DateUtil.toDate(endDate);

    const activity = await this.activityRepository.findAllBetweenDateAndDate(
      userId,
      start,
      end,
    );

    const character = _.groupBy(
      await this.characterRepository.findAllCharacterByUserId(userId),
      'id',
    );

    const monthlyCharacterCount = {};
    const dailyActivities = {};

    // 조회한 activity 값들을 바탕으로, 그 달의 캐츄와 일자 별 캐츄를 찾기 위해 정보 가공
    activity.map((o) => {
      monthlyCharacterCount[o.character_id] =
        (monthlyCharacterCount[o.character_id] || 0) + 1;
      if (dailyActivities[dayjs(o.date).date()]) {
        dailyActivities[dayjs(o.date).date()].push(o);
      } else {
        dailyActivities[dayjs(o.date).date()] = [o];
      }
    });

    /**
     * 이 달의 캐츄를 찾는 작업
     */
    const monthlyCharacterId = Object.keys(monthlyCharacterCount).reduce(
      (a, b) => (monthlyCharacterCount[a] > monthlyCharacterCount[b] ? a : b),
    );

    const monthlyCharacterData = character[monthlyCharacterId][0];

    const monthly = {
      id: monthlyCharacterData.id,
      name: monthlyCharacterData.name,
      type: monthlyCharacterData.type,
      level: monthlyCharacterData.level,
      catching: monthlyCharacterCount[monthlyCharacterId],
    };

    /**
     * 일자별 캐츄를 찾는 작업
     */
    const daily: DailyCharacterDataForCalenderResponseDTO[] = [];
    for (const day in dailyActivities) {
      const dailyCount = _.countBy(dailyActivities[day], 'character_id');

      const dailyCharacterId = Object.keys(dailyCount).reduce((a, b) =>
        dailyCount[a] > dailyCount[b] ? a : b,
      );

      const characterData = character[dailyCharacterId][0];
      daily.push({
        day: parseInt(day),
        id: characterData.id,
        type: characterData.type,
        level: characterData.level,
      });
    }

    return { monthly, daily };
  }

  async getSpecificDate(userId: number, date: string) {
    const target = dayjs(date, 'YYYYMMDD').add(9, 'h').toDate();
    const activity = await this.activityRepository.findByDate(userId, target);

    const dailyActivitiesCount: { [key: string]: number } = {};

    activity.map((o) => {
      dailyActivitiesCount[o.character_id] =
        (dailyActivitiesCount[o.character_id] || 0) + 1;
    });

    const characterIds = Object.entries(dailyActivitiesCount)
      .sort((a, b) => b[1] - a[1])
      .map((o) => parseInt(o[0]));

    const character = await this.characterRepository.findManyForDailyCharacter(
      characterIds,
    );

    const result: Pick<Character, 'id' | 'name' | 'type' | 'level'>[] =
      character.reduce((acc, cur) => {
        const characterData: Pick<Character, 'id' | 'name' | 'type' | 'level'> =
          {
            id: cur.id,
            name: cur.name,
            type: cur.type,
            level: cur.level,
          };
        acc.push(characterData);
        return acc;
      }, []);
    return result;
  }
}
