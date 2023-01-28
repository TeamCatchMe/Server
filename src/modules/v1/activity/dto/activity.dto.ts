import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class ActivityDto {
  @ApiProperty({
    description: '활동의 id 값',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '활동을 작성한 유저의 id 값',
    required: true,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '활동한 캐츄의 id 값',
    required: true,
  })
  @IsNumber()
  character_id: number;

  @ApiProperty({
    description: '활동의 내용',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '활동에 포함된 이미지 링크',
    nullable: true,
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: '활동의 날짜',
  })
  @IsDate()
  date: Date;

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
