import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class UserDTO {
  @ApiProperty({
    description: '유저의 id 값',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  uuid: string;

  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  nickname: string;

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
