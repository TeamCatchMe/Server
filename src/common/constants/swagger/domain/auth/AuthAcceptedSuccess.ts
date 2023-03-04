import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from 'src/common/constants';

@ApiExtraModels()
export class AuthLoginAccepted {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.ACCEPTED,
  })
  status: number;

  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '회원가입 필요',
  })
  message: string;
}
