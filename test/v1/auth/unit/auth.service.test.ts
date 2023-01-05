import { ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { anyNumber, instance, mock, reset, when } from 'ts-mockito';

describe('AuthService 테스트', () => {
  let service: AuthService;
  let authRepository: AuthRepositoryInterface;

  enum AUTH_TYPE {
    LOGIN,
    SIGNUP,
  }

  beforeEach(async () => {
    authRepository = mock(AuthRepository);
    let authRepositoryInstance = instance(authRepository);
    service = new AuthService(authRepositoryInstance);
  });

  afterEach(async () => {
    reset(authRepository);
  });

  it(`Service 및 Repository 정의 테스트`, () => {
    expect(service).toBeDefined();
    expect(authRepository).toBeDefined();
  });

  describe(`✔️ 회원 가입 테스트`, () => {
    it(`회원 가입에 성공한 경우`, async () => {
      when(await authRepository.findUserByUuid(anyNumber())).thenReturn();
      when(
        await authRepository.createUser('google', 'token_example'),
      ).thenReturn(createUser({ provider: 'google' }));

      const input = createUser({ provider: 'google' });
      const result = await service.signup('google', 'token_example');

      expect(input.nickname).toBe(result.nickname);
      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(result.type).toBe(AUTH_TYPE.SIGNUP);
    });

    it(`이미 가입한 유저인 경우 ConflictException이 발생한다.`, async () => {
      when(await authRepository.findUserByUuid('1234')).thenReturn(
        createUser({ uuid: '1234' }),
      );

      const result = async () => {
        await service.signup('google', 'token_example');
      };

      expect(result).rejects.toThrowError(
        new ConflictException('이미 가입한 유저입니다.'),
      );
    });
  });

  describe(`✔️ 로그인 테스트`, () => {
    it(`로그인에 성공한 경우`, async () => {
      when(await authRepository.updateRefreshToken(1)).thenReturn(
        createUser({}),
      );

      const result = await service.login(1);

      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(result.type).toBe(AUTH_TYPE.LOGIN);
    });

    it(`존재하지 않는 유저인 경우 NotFoundException이 발생한다.`, async () => {});

    it(`알 수 없는 서버 에러로 InternalServerException이 발생한다.`, async () => {});
  });

  describe(`✔️ 회원 탈퇴 테스트`, () => {
    it(`회원 탈퇴에 성공한 경우`, async () => {});

    it(`올바르지 않은 유저 토큰인 경우 UnauthorizedException이 발생한다.`, async () => {});

    it(`존재하지 않는 유저인 경우 NotFoundException이 발생한다.`, async () => {});

    it(`알 수 없는 서버 에러로 InternalServerException이 발생한다.`, async () => {});
  });

  describe(`✔️ 토큰 재발급 테스트`, () => {
    it(`회원 탈퇴에 성공한 경우`, async () => {});
    it(`존재하지 않는 유저의 토큰인 경우 NotFoundException이 발생한다.`, async () => {});
    it(`유효하지 않은 Access 토큰인 경우 UnauthorizedException이 발생한다.`, async () => {});
    it(`유효하지 않은 Refresh 토큰인 경우 UnauthorizedException이 발생한다.`, async () => {});
    it(`모든 토큰이 만료된 경우 UnauthorizedException이 발생한다.`, async () => {});
    it(`알 수 없는 서버 에러로 InternalServerException이 발생한다.`, async () => {});
  });
});

const createUser = (params: Partial<User>) => {
  const user: User = {
    id: params.id || 2,
    uuid: params.uuid || '9999',
    provider: params.provider || 'social',
    nickname: params.nickname || 'testUser',
    is_delete: params.is_delete || false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return user;
};
