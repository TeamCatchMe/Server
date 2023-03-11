import { ActivityDto } from '@modules/v1/activity/dto/activity.dto';
import { UserDTO } from '@modules/v1/user/dto/user.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

class MonthlyCharacterDataForCalenderResponseDTO extends PickType(
  CharacterDTO,
  ['id', 'name', 'type', 'level'],
) {
  @ApiProperty({ description: '해당 캐츄의 이달의 활동 수', example: 10 })
  catching: number;
}

export class DailyCharacterDataForCalenderResponseDTO extends PickType(
  CharacterDTO,
  ['id', 'type', 'level'],
) {
  @ApiProperty({ description: '일자 정보', example: 1 })
  day: number;
}

export class CharacterGetCalenderResponseDTO {
  @ApiProperty({
    description: '이달의 캐츄의 정보',
    type: MonthlyCharacterDataForCalenderResponseDTO,
  })
  monthly: MonthlyCharacterDataForCalenderResponseDTO;

  @ApiProperty({
    description: '일자별 캐츄 정보',
    type: [DailyCharacterDataForCalenderResponseDTO],
  })
  daily: DailyCharacterDataForCalenderResponseDTO[];
}
