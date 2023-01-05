import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AUTH } from '../common/auth.type';

export class AuthResponseDTO {
  @ApiProperty() private readonly type: AUTH;
  @ApiProperty() private readonly id: number;
  @ApiProperty() private readonly nickname: string;
  @ApiProperty() private readonly accessToken: string;
  @ApiProperty() private readonly refreshToken: string;

  constructor(type: AUTH, user: User, accessToken: string) {
    this.type = type;
    this.id = user.id;
    this.nickname = user.nickname;
    this.accessToken = accessToken;
    this.refreshToken = user.refresh_token;
  }

  get getType() {
    return this.type;
  }

  get getId() {
    return this.id;
  }

  get getNickname() {
    return this.nickname;
  }

  get getAccessToken() {
    return this.accessToken;
  }

  get getRefreshToken() {
    return this.refreshToken;
  }
}
