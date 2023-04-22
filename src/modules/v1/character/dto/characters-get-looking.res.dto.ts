import { ActivityDto } from '@modules/v1/activity/dto/activity.dto';
import { UserDTO } from '@modules/v1/user/dto/user.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

class UserDataForLookingResponseDTO extends PickType(UserDTO, [
  'id',
  'nickname',
]) {}

export class ActivityDataForLookingDTO extends PickType(ActivityDto, [
  'id',
  'content',
  'image',
  'character_id',
]) {
  @ApiProperty({
    description: '활동의 날짜(YYYYMMDDHHmmss)',
  })
  date: string;

  @ApiProperty({
    description: '활동의 생성 날짜(YYYYMMDDHHmmss)',
  })
  createdAt: string;
}
class ActivityDataForLookingResponseDTO extends PickType(ActivityDto, [
  'id',
  'content',
  'image',
]) {
  @ApiProperty({
    description: '활동의 날짜(YYYYMMDDHHmmss)',
  })
  date: string;

  @ApiProperty({
    description: '활동의 생성 날짜(YYYYMMDDHHmmss)',
  })
  createdAt: string;
}

export class FindAllCharactersForLookingDTO extends PickType(CharacterDTO, [
  'id',
  'name',
  'type',
  'level',
]) {
  @ApiProperty({
    description: '캐츄의 유져 정보',
    type: UserDataForLookingResponseDTO,
  })
  User: UserDataForLookingResponseDTO;
}

export class CharactersGetLookingResponseDTO extends PickType(CharacterDTO, [
  'id',
  'name',
  'type',
  'level',
]) {
  @ApiProperty({
    description: '캐츄의 유져 정보',
    type: UserDataForLookingResponseDTO,
  })
  User: UserDataForLookingResponseDTO;

  @ApiProperty({
    description: '캐츄의 가장 최근 활동 정보',
    type: ActivityDataForLookingResponseDTO,
  })
  Activity: ActivityDataForLookingResponseDTO;
}
