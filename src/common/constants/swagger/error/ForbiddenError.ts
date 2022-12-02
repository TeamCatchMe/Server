import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class ForbiddenError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.FORBIDDEN,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    description: '응답 데이터',
    example: '요청 값에 문제가 있습니다.',
  })
  message: string;
}
