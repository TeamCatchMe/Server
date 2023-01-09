import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Activity } from '@prisma/client';
import dayjs from 'dayjs';
import { instance, mock, reset, when } from 'ts-mockito';

describe('ActivityService 테스트', () => {
  let service: ActivityService,
    activityRepository: ActivitiyRepositoryInterface;

  const CONTENT = 'test content';
  const UPDATED_CONTENT = 'updated content';
  const CHARACTER_ID = 1;
  const ACTIVITY_ID = 1;
  const USER_ID = 1;

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
        await activityRepository.create(USER_ID, CHARACTER_ID, CONTENT),
      ).thenReturn(createActivity({ content: CONTENT }));

      const result = await service.createActivity(
        USER_ID,
        CHARACTER_ID,
        CONTENT,
      );

      expect(result.getId).toBe(1);
      expect(result.getContent).toBe(CONTENT);
    });
  });

  describe('✔️ 활동 수정 테스트', () => {
    it('활동 수정에 성공한 경우', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({}),
      );
      when(
        await activityRepository.findByIdAndUserId(ACTIVITY_ID, USER_ID),
      ).thenReturn(createActivity({}));
      when(
        await activityRepository.update(USER_ID, ACTIVITY_ID, UPDATED_CONTENT),
      ).thenReturn(createActivity({ content: UPDATED_CONTENT }));

      const result = await service.updateActivity(
        USER_ID,
        ACTIVITY_ID,
        UPDATED_CONTENT,
      );

      expect(result.getId).toBe(1);
    });

    it('존재하지 않는 활동의 Id인 경우 NotFoundException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn();

      const result = async () => {
        await service.updateActivity(ACTIVITY_ID, UPDATED_CONTENT);
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 활동 Id입니다.'),
      );
    });

    it('본인의 활동이 아닌 경우 BadRequestException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({}),
      );
      when(
        await activityRepository.findByIdAndUserId(ACTIVITY_ID, USER_ID),
      ).thenReturn();

      const result = async () => {
        await service.updateActivity(USER_ID, ACTIVITY_ID, UPDATED_CONTENT);
      };

      expect(result).rejects.toThrowError(
        new BadRequestException('다른 유저의 활동을 수정할 수 없습니다.'),
      );
    });
  });

  describe('✔️ 활동 삭제 테스트', () => {
    it('활동 삭제에 성공한 경우', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({}),
      );
      when(
        await activityRepository.findByIdAndUserId(ACTIVITY_ID, USER_ID),
      ).thenReturn(createActivity({}));
      when(await activityRepository.delete(ACTIVITY_ID)).thenReturn();

      const result = await service.deleteActivity(USER_ID, ACTIVITY_ID);

      expect(result.getId).toBe(1);
    });

    it('존재하지 않는 활동의 Id인 경우 NotFoundException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn();

      const result = async () => {
        await service.deleteActivity(USER_ID, ACTIVITY_ID);
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 활동 Id입니다.'),
      );
    });

    it('본인의 활동이 아닌 경우 BadRequestException이 발생한다.', async () => {
      when(await activityRepository.findById(ACTIVITY_ID)).thenReturn(
        createActivity({}),
      );
      when(
        await activityRepository.findByIdAndUserId(ACTIVITY_ID, USER_ID),
      ).thenReturn();

      const result = async () => {
        await service.deleteActivity(USER_ID, ACTIVITY_ID);
      };

      expect(result).rejects.toThrowError(
        new BadRequestException('다른 유저의 활동을 삭제할 수 없습니다.'),
      );
    });
  });
});

const createActivity = (params: Partial<Activity>) => {
  const activity: Activity = {
    id: params.id || 1,
    character_id: params.id || 1,
    content: params.content || 'new content',
    image: params.image || 'new image',
    date: params.date || dayjs().toDate(),
    is_delete: params.is_delete || false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return activity;
};
