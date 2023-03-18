import { ActivityResponseDTO } from '@modules/v1/activity/dto/activity.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { CREATED_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class ActivityCreateSuccess extends PickType(CREATED_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '활동 생성 성공',
  })
  message: string;

  @ApiProperty({
    type: ActivityResponseDTO,
  })
  data: ActivityResponseDTO;
}
