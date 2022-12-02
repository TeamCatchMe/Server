import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class UnprocessableEntityError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.UNPROCESSABLE,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    description: '서버가 요청을 이해하고 요청 문법도 올바르지만 요청된 지시를 따를 수 없음을 나타냅니다.',
    example: '요청된 지시를 따를 수 없습니다.',
  })
  message: string;
}
