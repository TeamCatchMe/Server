import { ActivityResponseDTO } from '@modules/v1/activity/dto/activity.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class ActivityDateAllGetSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '활동 조회 성공',
  })
  message: string;

  @ApiProperty({
    type: ActivityResponseDTO,
    isArray: true,
  })
  data: ActivityResponseDTO[];
}
