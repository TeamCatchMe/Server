import { CharacterGetCalenderResponseDTO } from '@modules/v1/character/dto/character-get-calender.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class CharacterGetCalenderSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '캘린더 조회에 성공했습니다',
  })
  message: string;

  @ApiProperty({
    type: CharacterGetCalenderResponseDTO,
    title: '캘린더 조회 정보 ',
  })
  data: CharacterGetCalenderResponseDTO;
}
