import { CharacterGetFromMainResponseDTO } from '@modules/v1/character/dto/character-get-from-main.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class CharacterGetFromMainSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '캐츄 메인 목록 조회 성공',
  })
  message: string;

  @ApiProperty({
    type: [CharacterGetFromMainResponseDTO],
    title: '캐츄 목록',
  })
  data: CharacterGetFromMainResponseDTO[];
}
