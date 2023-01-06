import { rm, TOKEN_TYPE } from '@common/constants';
import { JwtPayload } from '@common/constants/jwt/jwtPayload';
import { JwtHandlerService } from '@config/services/jwt-handler.service';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserRepositoryInterface,
  USER_REPOSITORY,
} from '../user/interfaces/user-repository.interface';
import { AuthRepositoryInterface, AUTH_REPOSITORY } from './auth.interface';
import { authStrategy } from './common/auth.strategy';
import { AUTH, SocialPlatform } from './common/auth.type';
import { AuthResponseDTO } from './dto/auth.res.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwt: JwtHandlerService,
  ) {}

  async login(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(rm.NO_USER_ID);

    const jwtPayload: JwtPayload = { ...user };
    const newAccessToken = this.jwt.getAccessToken(jwtPayload);
    const newRefreshToken = this.jwt.getRefreshToken();

    const updatedUser = await this.authRepository.updateRefreshToken(
      user.id,
      newRefreshToken,
    );
    return new AuthResponseDTO(AUTH.LOGIN, updatedUser, newAccessToken);
  }

  async signup(social: SocialPlatform, uuid: string, nickname: string) {
    const newRefreshToken = this.jwt.getRefreshToken();
    const existedUser = this.authRepository.findByUuid(uuid);
    if (existedUser) throw new ConflictException(rm.ALREADY_SIGNED_USER);

    const alreadyUsedNickname = this.userRepository.findByNickname(nickname);
    if (alreadyUsedNickname) throw new ConflictException(rm.ALREADY_USER_NAME);

    const user = await this.authRepository.create(
      social,
      uuid,
      nickname,
      newRefreshToken,
    );

    const jwtPayload: JwtPayload = { ...user };
    const newAccessToken = this.jwt.getAccessToken(jwtPayload);
    return new AuthResponseDTO(AUTH.SIGNUP, user, newAccessToken);
  }

  async renewalToken(accessToken: string, refreshToken: string) {
    const decodedAccessToken = this.jwt.verify(accessToken);

    if (decodedAccessToken === TOKEN_TYPE.TOKEN_INVALID) {
      throw new UnauthorizedException(rm.INVALID_ACCESS_TOKEN);
    }
    if (decodedAccessToken === TOKEN_TYPE.TOKEN_EXPIRED) {
      const decodedRefreshToken = this.jwt.verify(refreshToken);

      if (decodedRefreshToken === TOKEN_TYPE.TOKEN_INVALID) {
        throw new UnauthorizedException(rm.INVALID_REFRESH_TOKEN);
      }
      if (decodedRefreshToken === TOKEN_TYPE.TOKEN_EXPIRED) {
        throw new UnauthorizedException(rm.EXPIRED_ALL_TOKEN);
      }

      const user = await this.authRepository.findByRefreshToken(refreshToken);
      if (!user) throw new NotFoundException(rm.NO_USER_TOKEN);
      return this.jwt.getAccessToken(user);
    }

    const user = await this.userRepository.findById(decodedAccessToken.id);
    if (!user) throw new NotFoundException(rm.NO_USER_TOKEN);
  }

  async withdraw(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(rm.NO_USER_ID);

    await this.authRepository.delete(userId);
  }

  async getUuidFromSocialToken(social: SocialPlatform, token: string) {
    const user = await authStrategy[social].execute(token);
    return user;
  }
}
