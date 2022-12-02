import { sc } from '..';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export default class AcceptedSuccess {
  @ApiProperty({
    type: 'number',
    description: 'HTTP 상태 코드',
    example: sc.ACCEPTED,
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
  })
  data: string;
}
