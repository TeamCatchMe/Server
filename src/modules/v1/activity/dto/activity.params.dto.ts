import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ActivityParamsDto {
  @ApiProperty({
    description: '활동의 id 값',
    required: true,
  })
  @IsNumber()
  activity_id: number;
}
