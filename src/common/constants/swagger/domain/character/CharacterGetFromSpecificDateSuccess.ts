import { CharacterGetSpecificDateResponseDTO } from '@modules/v1/character/dto/character-get-specificDate.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class CharacterGetSpecificDateSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '특정 일자 캐츄 조회 성공',
  })
  message: string;

  @ApiProperty({
    type: CharacterGetSpecificDateResponseDTO,
    title: '특정 일자 캐릭터 조회 정보 ',
  })
  data: CharacterGetSpecificDateResponseDTO;
}
