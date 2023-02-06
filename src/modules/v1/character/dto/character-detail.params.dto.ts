import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CharacterIdParamsDTO {
  @ApiProperty({
    description: '활동의 id 값',
    required: true,
  })
  @IsNumber()
  character_id: number;
}
