import { PickType } from '@nestjs/swagger';
import { ActivityDto } from './activity.dto';

export class ActivityCharacterParamsDTO extends PickType(ActivityDto, [
  'character_id',
]) {}
