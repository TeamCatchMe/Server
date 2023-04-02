import { SocialPlatform } from '@modules/v1/auth/common/auth.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDTO {
  @ApiProperty({
    description: '유저의 id 값',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '유저의 uuid 값입니다.',
    required: true,
  })
  @IsString()
  uuid: string;

  @ApiProperty({
    description: '유저가 가입한 소셜 플랫폼 경로입니다.',
    required: true,
  })
  @IsString({ message: '소셜 값은 문자여야 합니다.' })
  @IsIn(['kakao', 'apple', 'naver', 'google'], {
    message: `소셜 값은 'kakao', 'apple', 'naver', 'google'만 사용 가능합니다.`,
  })
  @IsNotEmpty({ message: '소셜 값은 필수입니다.' })
  provider: SocialPlatform;

  @ApiProperty({
    description: '유저의 닉네임입니다.',
    required: true,
  })
  @IsString({ message: '유저의 닉네임은 문자열이여야 합니다.' })
  @MinLength(1, { message: '닉네임은 1자 이상 10자 이하이여야 합니다.' })
  @MaxLength(10, { message: '닉네임은 1자 이상 10자 이하이여야 합니다.' })
  nickname: string;

  @ApiProperty({
    description: 'Refresh 토큰 값입니다.',
    required: true,
    example: 'refresh token here',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;

  @ApiProperty()
  @IsBoolean()
  is_delete: boolean;
}
