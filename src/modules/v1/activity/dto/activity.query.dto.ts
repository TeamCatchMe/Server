import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ActivityQueryDTO {
  @ApiProperty({
    description: '활동한 날짜 범위의 시작 일자. (YYYYMMDD)',
    required: true,
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: '활동한 날짜 범위의 종료 일자. (YYYYMMDD)',
    required: true,
  })
  @IsString()
  endDate: string;
}
