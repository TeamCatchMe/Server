import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ACCEPTED_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class AuthTokenGetAccepted extends PickType(ACCEPTED_TYPE, ['status'] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '토큰이 유효합니다.',
    description: '토큰이 유효하여 재발급하지 않습니다.',
  })
  message: string;
}
