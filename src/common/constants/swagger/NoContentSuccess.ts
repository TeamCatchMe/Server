import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { sc } from '..';

@ApiExtraModels()
export default class NoContentSuccess {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.NO_CONTENT,
  })
  status: number;

  @ApiProperty({
    type: 'string',
    title: '응답 메시지',
    example: '',
    description: '',
  })
  message: string;

  @ApiProperty({
    type: 'string',
    description: '응답 데이터',
    example: '',
    isArray: true,
  })
  data: any[];
}
