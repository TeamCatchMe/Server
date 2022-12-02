import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '../..';

@ApiExtraModels()
export class BadRequestError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.BAD_REQUEST,
  })
  status: number;

  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '잘못된 요청 값입니다.',
    description: `
    Request-Body의 각각 프로퍼티의 제약조건에 맞지 않은 값이 포함되어 있습니다. \n
    해당 예시에 나와 있는 오류중에 적어도 한 개의 조건에 맞지 않아 요청이 실패했습니다. \n
    `,
  })
  message: string;
}
