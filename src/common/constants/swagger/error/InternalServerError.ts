import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class InternalServerError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.INTERNAL_SERVER_ERROR,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '서버 내부 오류입니다.',
    description: 'Server Error',
  })
  message: string;
}
