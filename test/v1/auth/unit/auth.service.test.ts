import { ApiConfigService } from '@config/services/api-config.service';
import { JwtHandlerService } from '@config/services/jwt-handler.service';
import { AuthRepositoryInterface } from '@modules/v1/auth/auth.interface';
import AuthRepository from '@modules/v1/auth/auth.repository';
import { AuthService } from '@modules/v1/auth/auth.service';
import { UserRepositoryInterface } from '@modules/v1/user/interfaces/user-repository.interface';
import { UserRepository } from '@modules/v1/user/user.repository';
import { UserService } from '@modules/v1/user/user.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  anyNumber,
  anyString,
  anything,
  instance,
  mock,
  reset,
  when,
} from 'ts-mockito';

describe('AuthService 테스트', () => {
  let service: AuthService;
  let userService: UserService;
  let jwt: JwtHandlerService;
  let configService: ApiConfigService;
  let authRepository: AuthRepositoryInterface;
  let userRepository: UserRepositoryInterface;

  enum AUTH_TYPE {
    LOGIN = 'LOGIN',
    SIGNUP = 'SIGNUP',
  }

  beforeEach(async () => {
    authRepository = mock(AuthRepository);
    userRepository = mock(UserRepository);
    jwt = mock(JwtHandlerService);
    let authRepositoryInstance = instance(authRepository);
    let userRepositoryInstance = instance(userRepository);
    let jwtInstance = instance(jwt);

    service = new AuthService(
      authRepositoryInstance,
      userRepositoryInstance,
      jwtInstance,
    );
  });

  afterEach(async () => {
    reset(authRepository);
  });

  it(`Service 및 Repository 정의 테스트`, () => {
    expect(service).toBeDefined();
    expect(jwt).toBeDefined();
    expect(authRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe(`✔️ 회원 가입 테스트`, () => {
    const SOCIAL = 'google';
    const TEST_UUID = 'test_uuid';
    const TEST_NICKNAME = 'test_nickname';
    const TEST_REFRESH_TOKEN = 'test_refresh_token';
    const TEST_ACCESS_TOKEN = 'test_access_token';

    it(`회원 가입에 성공한 경우`, async () => {
      const user = createUser({
        provider: SOCIAL,
        uuid: TEST_UUID,
        nickname: TEST_NICKNAME,
        refresh_token: TEST_REFRESH_TOKEN,
      });

      when(jwt.getRefreshToken()).thenReturn(TEST_REFRESH_TOKEN);
      when(await authRepository.findByUuid(anyString())).thenReturn();
      when(
        await authRepository.create(
          SOCIAL,
          TEST_UUID,
          TEST_NICKNAME,
          TEST_REFRESH_TOKEN,
        ),
      ).thenReturn(user);

      when(jwt.getAccessToken(anything())).thenReturn(TEST_ACCESS_TOKEN);
      const result = await service.signup(SOCIAL, TEST_UUID, TEST_NICKNAME);

      expect(TEST_NICKNAME).toBe(result.getNickname);
      expect(result.getAccessToken).toBeTruthy();
      expect(result.getRefreshToken).toBeTruthy();
      expect(result.getType).toBe(AUTH_TYPE.SIGNUP);
    });

    it(`이미 가입한 유저인 경우 ConflictException이 발생한다.`, async () => {
      when(await authRepository.findByUuid(TEST_UUID)).thenReturn(
        createUser({ uuid: TEST_UUID }),
      );

      const result = async () => {
        await service.signup(SOCIAL, TEST_UUID, TEST_NICKNAME);
      };

      expect(result).rejects.toThrowError(
        new ConflictException('이미 가입한 유저입니다.'),
      );
    });
  });

  describe(`✔️ 로그인 테스트`, () => {
    let TEST_ACCESS_TOKEN = 'test_access_token';
    let TEST_REFRESH_TOKEN = 'test_refresh_token';

    it(`로그인에 성공한 경우`, async () => {
      when(await userRepository.findById(1)).thenReturn(createUser({ id: 1 }));
      when(jwt.getAccessToken(anything())).thenReturn(TEST_ACCESS_TOKEN);
      when(jwt.getRefreshToken()).thenReturn(TEST_REFRESH_TOKEN);
      when(
        await authRepository.updateRefreshToken(1, TEST_REFRESH_TOKEN),
      ).thenReturn(createUser({ id: 1, refresh_token: TEST_REFRESH_TOKEN }));

      const result = await service.login(1);

      expect(result.getAccessToken).toBe(TEST_ACCESS_TOKEN);
      expect(result.getRefreshToken).toBe(TEST_REFRESH_TOKEN);
      expect(result.getType).toBe(AUTH_TYPE.LOGIN);
    });

    it(`존재하지 않는 유저인 경우 NotFoundException이 발생한다.`, async () => {
      when(await userRepository.findById(1)).thenReturn();

      const result = async () => {
        await service.login(1);
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저 Id입니다.'),
      );
    });
  });

  describe(`✔️ 회원 탈퇴 테스트`, () => {
    it(`회원 탈퇴에 성공한 경우`, async () => {
      userService = new UserService(instance(mock(UserRepository)));

      when(await userRepository.findById(1))
        .thenReturn(createUser({ id: 1 }))
        .thenReturn();
      when(await authRepository.delete(1)).thenReturn();

      await service.withdraw(1);
      const result = await userService.findUserById(1);

      expect(result).toBeNull();
    });

    it(`존재하지 않는 유저인 경우 NotFoundException이 발생한다.`, async () => {
      when(await userRepository.findById(1)).thenReturn();

      const result = async () => {
        await service.withdraw(1);
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저 Id입니다.'),
      );
    });
  });

  describe(`✔️ 토큰 재발급 테스트`, () => {
    const INVALID = -2;
    const EXPIRED = -3;
    const TEST_ACCESS_TOKEN = 'test_access_token';
    const TEST_REFRESH_TOKEN = 'test_refresh_token';

    it(`토큰 재발급에 성공한 경우`, async () => {
      when(await userRepository.findById(1)).thenReturn(createUser({}));
      when(jwt.verify(TEST_ACCESS_TOKEN)).thenReturn(EXPIRED);
      when(jwt.verify(TEST_REFRESH_TOKEN)).thenReturn(1);

      when(
        await authRepository.findByRefreshToken(TEST_REFRESH_TOKEN),
      ).thenReturn(createUser({ refresh_token: TEST_REFRESH_TOKEN }));

      when(jwt.getAccessToken(anything())).thenReturn('new_access_token');

      const result = await service.renewalToken(
        TEST_ACCESS_TOKEN,
        TEST_REFRESH_TOKEN,
      );

      expect(result).not.toEqual(TEST_ACCESS_TOKEN);
    });

    it(`존재하지 않는 유저의 토큰인 경우 NotFoundException이 발생한다.`, async () => {
      when(jwt.verify(TEST_ACCESS_TOKEN)).thenReturn(EXPIRED);
      when(await userRepository.findById(anyNumber())).thenReturn();
      when(
        await authRepository.findByRefreshToken(TEST_REFRESH_TOKEN),
      ).thenReturn();

      const result = async () => {
        await service.renewalToken(TEST_ACCESS_TOKEN, TEST_REFRESH_TOKEN);
      };

      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저의 토큰입니다.'),
      );
    });

    it(`유효하지 않은 Access 토큰인 경우 UnauthorizedException이 발생한다.`, async () => {
      when(jwt.verify(TEST_ACCESS_TOKEN)).thenReturn(INVALID);

      const result = async () => {
        await service.renewalToken(TEST_ACCESS_TOKEN, TEST_REFRESH_TOKEN);
      };

      expect(result).rejects.toThrowError(
        new UnauthorizedException('유효하지 않은 액세스 토큰입니다.'),
      );
    });

    it(`유효하지 않은 Refresh 토큰인 경우 UnauthorizedException이 발생한다.`, async () => {
      when(jwt.verify(TEST_ACCESS_TOKEN)).thenReturn(EXPIRED);
      when(jwt.verify(TEST_REFRESH_TOKEN)).thenReturn(INVALID);

      const result = async () => {
        await service.renewalToken(TEST_ACCESS_TOKEN, TEST_REFRESH_TOKEN);
      };

      expect(result).rejects.toThrowError(
        new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.'),
      );
    });

    it(`모든 토큰이 만료된 경우 UnauthorizedException이 발생한다.`, async () => {
      when(jwt.verify(TEST_ACCESS_TOKEN)).thenReturn(EXPIRED);
      when(jwt.verify(TEST_REFRESH_TOKEN)).thenReturn(EXPIRED);

      const result = async () => {
        await service.renewalToken(TEST_ACCESS_TOKEN, TEST_REFRESH_TOKEN);
      };

      expect(result).rejects.toThrowError(
        new UnauthorizedException('모든 토큰이 만료되었습니다.'),
      );
    });
  });
});

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
