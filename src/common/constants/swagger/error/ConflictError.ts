import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class ConflictError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.CONFLICT,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '요청이 충돌했습니다.',
    description: 'Conflict',
  })
  message: string;
}
