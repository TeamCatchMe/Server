import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UserNicknameQueryDTO extends PickType(UserDTO, ['nickname']) {}
