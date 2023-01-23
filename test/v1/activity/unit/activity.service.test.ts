import { ActivityRepository } from '@modules/v1/activity/activity.repository';
import { ActivityService } from '@modules/v1/activity/activity.service';
import { ActivityRepositoryInterface } from '@modules/v1/activity/interfaces/activity-repository.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Activity } from '@prisma/client';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { instance, mock, reset, when } from 'ts-mockito';
dayjs.extend(CustomParseFormat);

const CONTENT = 'test content';
const UPDATED_CONTENT = 'updated content';
const DATE_STRING = '20230101';
const DATE = dayjs(DATE_STRING, 'YYYYMMDD').toDate();
const CHARACTER_ID = 1;
const ACTIVITY_ID = 1;
const USER_ID = 1;

describe('ActivityService 테스트', () => {
  let service: ActivityService, activityRepository: ActivityRepositoryInterface;

  beforeEach(async () => {
    activityRepository = mock(ActivityRepository);
    let activityRepositoryInstance = instance(activityRepository);
    service = new ActivityService(activityRepositoryInstance);
  });

  afterEach(async () => {
    reset(activityRepository);
  });

  it(`Service 및 Repository 정의 테스트`, () => {
    expect(service).toBeDefined();
    expect(activityRepository).toBeDefined();
  });

  describe('✔️ 캘린더 조회 테스트', () => {
    it('캘린더 조회에 성공한 경우', async () => {});
  });

  describe('✔️ 특정 일자 캐릭터 조회 테스트', () => {
    it('특정 일자 캐릭터 조회에 성공한 경우', async () => {});
  });

  describe('✔️ 활동 작성 테스트', () => {
    it('활동 작성에 성공한 경우', async () => {
      when(
        await activityRepository.create(USER_ID, CHARACTER_ID, CONTENT, DATE),
      ).thenReturn(createActivity({ content: CONTENT, date: DATE }));

      const result = await service.createActivity(
        USER_ID,
        CHARACTER_ID,
        CONTENT,
        DATE_STRING,
      );

      expect(result.id).toBe(1);
      expect(result.content).toBe(CONTENT);
    });
  });

  describe('✔️ 활동 수정 테스트', () => {
    it('활동 수정에 성공한 경우', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({}),
      );

      when(
        await activityRepository.update(ACTIVITY_ID, UPDATED_CONTENT, DATE),
      ).thenReturn(createActivity({ content: UPDATED_CONTENT }));

      const result = await service.updateActivity(
        USER_ID,
        ACTIVITY_ID,
        UPDATED_CONTENT,
        DATE_STRING,
      );

      expect(result.id).toBe(1);
      expect(result.content).toBe(UPDATED_CONTENT);
    });

    it('존재하지 않는 활동의 Id인 경우 NotFoundException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn();

      const result = async () => {
        await service.updateActivity(
          USER_ID,
          ACTIVITY_ID,
          UPDATED_CONTENT,
          DATE_STRING,
        );
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 활동 Id입니다.'),
      );
    });

    it('본인의 활동이 아닌 경우 ConflictException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({ user_id: 99 }),
      );

      const result = async () => {
        await service.updateActivity(
          USER_ID,
          ACTIVITY_ID,
          CONTENT,
          DATE_STRING,
        );
      };

      expect(result).rejects.toThrowError(
        new ConflictException('잘못된 접근입니다.'),
      );
    });
  });

  describe('✔️ 활동 삭제 테스트', () => {
    it('존재하지 않는 활동의 Id인 경우 NotFoundException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn();

      const result = async () => {
        await service.deleteActivity(USER_ID, ACTIVITY_ID);
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 활동 Id입니다.'),
      );
    });

    it('본인의 활동이 아닌 경우 ConflictException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({ user_id: 99 }),
      );

      const result = async () => {
        await service.deleteActivity(USER_ID, ACTIVITY_ID);
      };

      expect(result).rejects.toThrowError(
        new ConflictException('잘못된 접근입니다.'),
      );
    });
  });
});

const createActivity = (params: Partial<Activity>) => {
  const activity: Activity = {
    id: params.id || 1,
    user_id: params.user_id || 1,
    character_id: params.id || 1,
    content: params.content || CONTENT,
    image: params.image || 'new image',
    date: params.date || DATE,
    is_delete: params.is_delete || false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return activity;
};
