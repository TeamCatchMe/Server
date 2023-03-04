import { ActivityDto } from '@modules/v1/activity/dto/activity.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class ActivityCharacterGetSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '활동 조회 성공',
  })
  message: string;

  @ApiProperty({
    type: ActivityDto,
    isArray: true,
  })
  data: ActivityDto[];
}
