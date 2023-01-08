import { UserRepositoryInterface } from '@modules/v1/user/interfaces/user-repository.interface';
import { UserRepository } from '@modules/v1/user/user.repository';
import { UserService } from '@modules/v1/user/user.service';
import { ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { anyString, instance, mock, reset, when } from 'ts-mockito';

describe('UserService 테스트', () => {
  let service: UserService;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    userRepository = mock(UserRepository);
    let userRepositoryInstance = instance(userRepository);
    service = new UserService(userRepositoryInstance);
  });

  afterEach(async () => {
    reset(userRepository);
  });

  it(`Service 및 Repository 정의 테스트`, () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe(`✔️ 유저 닉네임 변경 테스트`, () => {
    it(`유저 닉네임 변경에 성공한 경우`, async () => {
      const NEW_NICKNAME = generateRandomString();

      // stub
      when(await userRepository.findByNickname(anyString())).thenReturn();
      when(await userRepository.updateNickname(1, NEW_NICKNAME)).thenReturn(
        createUser({ nickname: NEW_NICKNAME }),
      );

      const input = createUser({ nickname: NEW_NICKNAME });
      const result = await service.updateNickname(1, NEW_NICKNAME);

      expect(input.nickname).toBe(result.getNickname);
      expect(input.id).toBe(result.getId);
    });

    it(`이미 사용중인 닉네임인 경우 ConflictException으로 처리된다.`, async () => {
      const NEW_NICKNAME = generateRandomString();

      // stub
      when(await userRepository.findByNickname(NEW_NICKNAME)).thenReturn(
        createUser({ nickname: NEW_NICKNAME }),
      );

      const result = async () => {
        await service.updateNickname(1, NEW_NICKNAME);
      };

      await expect(result).rejects.toThrowError(
        new ConflictException('이미 사용중인 닉네임입니다.'),
      );
    });
  });

  describe(`✔️ 유저 닉네임 중복 체크 테스트`, () => {
    it(`유저 닉네임 중복 체크에 성공한 경우`, async () => {
      // stub
      when(await userRepository.findByNickname(anyString())).thenReturn();

      const result = await service.checkDuplicateNickname(anyString());

      expect(result).toBe(1);
    });

    it(`이미 사용중인 닉네임인 경우 ConflictException으로 처리된다.`, async () => {
      const NEW_NICKNAME = generateRandomString();

      // stub
      when(await userRepository.findByNickname(NEW_NICKNAME)).thenReturn(
        createUser({ nickname: NEW_NICKNAME }),
      );

      const result = async () => {
        await service.checkDuplicateNickname(NEW_NICKNAME);
      };

      await expect(result).rejects.toThrowError(
        new ConflictException('이미 사용중인 닉네임입니다.'),
      );
    });
  });
});

const generateRandomString = () => {
  return (Math.random() * 10).toString().replace('.', '');
};

const createUser = (params: Partial<User>) => {
  const user: User = {
    id: params.id || 2,
    uuid: params.uuid || '9999',
    provider: params.provider || 'social',
    nickname: params.nickname || 'testUser',
    refresh_token: params.refresh_token || 'refresh_token',
    is_delete: params.is_delete || false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return user;
};
