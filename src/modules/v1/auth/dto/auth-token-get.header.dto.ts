import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthTokenGetHeaderDTO {
  @ApiProperty({
    example: 'access token here',
    description: 'Access 토큰 값입니다.',
    required: true,
  })
  @IsNotEmpty({ message: 'Access 토큰은 필수입니다.' })
  @IsString({ message: 'Access 토큰은 문자여야 합니다.' })
  accesstoken: string;

  @ApiProperty({
    example: 'refresh token here',
    description: 'Refresh 토큰 값입니다.',
    required: true,
  })
  @IsNotEmpty({ message: 'Refresh 토큰은 필수입니다.' })
  @IsString({ message: 'Refresh 토큰은 문자여야 합니다.' })
  refreshtoken: string;
}
