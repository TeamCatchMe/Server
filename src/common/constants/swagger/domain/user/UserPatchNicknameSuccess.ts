import { UserPatchNicknameResponseDTO } from '@modules/v1/user/dto/user-nickname.patch.res.dto';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { OK_TYPE } from 'src/common/constants';

@ApiExtraModels()
export class UserPatchNicknameSuccess extends PickType(OK_TYPE, [
  'status',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 메시지',
    example: '닉네임 변경 성공',
  })
  message: string;

  @ApiProperty({
    type: UserPatchNicknameResponseDTO,
  })
  data: UserPatchNicknameResponseDTO;
}
