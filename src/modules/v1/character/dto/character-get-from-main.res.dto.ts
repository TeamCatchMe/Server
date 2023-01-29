import { PickType, ApiProperty } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

export class CharacterGetFromMainResponseDTO extends PickType(CharacterDTO, [
  'id',
  'name',
  'type',
  'level',
]) {
  @ApiProperty({
    description: '캐칭 수 (해당 캐츄의 활동 수)',
  })
  activity_count: number;

  @ApiProperty({
    description: '캐치 지수<br>(해당 캐츄 캐칭 수 / 총 캐칭 수)',
  })
  cachu_rate: number;
}
