import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_TYPE } from 'src/common/constants';
import { JwtPayload } from 'src/common/constants/jwt/jwtPayload';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class JwtHandlerService {
  constructor(private readonly jwt: JwtService, private readonly config: ApiConfigService) {}

  //* Access Token 발급
  getAccessToken(payload: JwtPayload) {
    return this.jwt.sign(payload, {
      secret: this.config.jwtConfig.jwtSecret,
      expiresIn: this.config.jwtConfig.jwtAccessExpiration,
    });
  }

  //* Refresh Token 발급
  getRefreshToken() {
    return this.jwt.sign(
      {},
      {
        secret: this.config.jwtConfig.jwtSecret,
        expiresIn: this.config.jwtConfig.jwtRefreshExpiration,
      },
    );
  }

  //* Token 검증
  verify(token: string) {
    let decoded: any;

    try {
      decoded = this.jwt.verify(token, { secret: this.config.jwtConfig.jwtSecret });
    } catch (error: any) {
      if (error.message === 'jwt expired') {
        return TOKEN_TYPE.TOKEN_EXPIRED;
      } else if (error.message === 'invalid token') {
        return TOKEN_TYPE.TOKEN_INVALID;
      } else {
        return TOKEN_TYPE.TOKEN_INVALID;
      }
    }

    return decoded;
  }
}
