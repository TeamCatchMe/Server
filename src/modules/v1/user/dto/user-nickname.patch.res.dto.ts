import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserPatchNicknameResponseDTO {
  @ApiProperty() private readonly id: number;
  @ApiProperty() private readonly nickname: string;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
  }

  get getId() {
    return this.id;
  }

  get getNickname() {
    return this.nickname;
  }
}
