import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CharacterDTO {
  @ApiProperty({
    description: '캐츄의 id 값',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '캐츄의 이름입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsString({ message: '캐츄의 이름은 문자열이여야 합니다.' })
  @MinLength(1, { message: '캐츄의 이름은 1자 이상 20자 이하이여야 합니다.' })
  @MaxLength(20, { message: '캐츄의 이름은 1자 이상 20자 이하이여야 합니다.' })
  name: string;

  @ApiProperty({
    description: '캐츄의 type 값입니다.',
    required: true,
  })
  @IsNumber()
  type: number;

  @ApiProperty({
    description: '캐츄의 level 값입니다.',
    required: true,
  })
  @IsNumber()
  level: number;

  @ApiProperty({
    description: '캐츄를 생성한 유저의 id 값입니다.',
    required: true,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '캐츄의 공개 여부 값 입니다.',
    required: true,
  })
  @IsBoolean()
  is_public: boolean;

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
