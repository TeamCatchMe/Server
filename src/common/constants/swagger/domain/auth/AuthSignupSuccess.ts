import { AuthResponseDTO } from '@modules/v1/auth/dto/auth.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { CREATED_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class AuthSignupSuccess extends PickType(CREATED_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '회원 가입 성공',
  })
  message: string;

  @ApiProperty({
    type: AuthResponseDTO,
  })
  data: AuthResponseDTO;
}
