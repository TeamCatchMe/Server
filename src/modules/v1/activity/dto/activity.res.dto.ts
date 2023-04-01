import { DateUtil } from '@common/libraries/date.util';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityDto } from './activity.dto';

export class ActivityResponseDTO {
  @ApiProperty() private readonly id: number;
  @ApiProperty() private readonly content: string;
  @ApiProperty() private readonly image: string;
  @ApiProperty() private readonly date: string;

  constructor(activity: ActivityDto) {
    this.id = activity.id;
    this.content = activity.content;
    this.image = activity.image;
    this.date = DateUtil.toFullString(activity.date);
  }
}
