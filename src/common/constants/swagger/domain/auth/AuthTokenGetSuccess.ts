import { AuthTokenGetResDTO } from '@modules/v1/auth/dto/auth-token-get.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class AuthTokenGetSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '토큰 재발급 성공',
  })
  message: string;

  @ApiProperty({
    type: AuthTokenGetResDTO,
  })
  data: AuthTokenGetResDTO;
}
