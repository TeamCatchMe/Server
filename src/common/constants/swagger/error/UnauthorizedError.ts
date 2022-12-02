import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class UnauthorizedError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.UNAUTHORIZED,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '인증 되지 않은 요청입니다.',
    description: 'Unauthorized',
  })
  message: string;
}
