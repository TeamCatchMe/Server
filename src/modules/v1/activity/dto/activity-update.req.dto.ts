import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ActivityDto } from './activity.dto';

export class ActivityUpdateRequestDto extends PickType(ActivityDto, [
  'content',
]) {
  @ApiProperty({
    description: '활동한 일자. (YYYYMMDD)',
    required: true,
  })
  @IsString()
  date: string;
}
