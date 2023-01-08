import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AuthTokenGetResDTO {
  @ApiProperty() @Exclude() private readonly accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }

  @Expose()
  get getAccessToken(): string {
    return this.accessToken;
  }
}
