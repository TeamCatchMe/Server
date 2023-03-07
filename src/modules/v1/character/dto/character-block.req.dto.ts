import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CharacterBlockRequestDTO {
  @ApiProperty({
    description: '차단할 캐츄의 id 값',
    required: true,
  })
  @IsNumber()
  id: number;
}
