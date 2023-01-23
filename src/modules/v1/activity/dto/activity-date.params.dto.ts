import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ActivityDateParamsDTO {
  @ApiProperty({
    description: '활동한 일자. (YYYYMMDD)',
    required: true,
  })
  @IsString()
  date: string;
}
