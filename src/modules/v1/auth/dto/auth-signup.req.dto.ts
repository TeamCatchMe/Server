import { UserDTO } from '@modules/v1/user/dto/user.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSignupRequestDTO extends PickType(UserDTO, [
  'provider',
  'nickname',
]) {
  @ApiProperty({
    example: 1,
    description: '소셜 토큰 값입니다.',
    required: true,
  })
  @IsNotEmpty({ message: '소셜 토큰 값은 필수입니다.' })
  @IsString({ message: '소셜 토큰 값은 문자여야 합니다.' })
  token: string;
}
