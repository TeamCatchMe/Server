import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class NotFoundError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.NOT_FOUND,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '요청 값을 찾을 수 없습니다.',
    description: 'Not Found',
  })
  message: string;
}
