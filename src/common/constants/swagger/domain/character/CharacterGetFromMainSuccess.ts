import { CharactersResponseDTO } from '@modules/v1/character/dto/characters.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class CharacterGetListSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '캐츄 목록 조회 성공',
  })
  message: string;

  @ApiProperty({
    type: [CharactersResponseDTO],
    title: '캐츄 목록',
  })
  data: CharactersResponseDTO[];
}
