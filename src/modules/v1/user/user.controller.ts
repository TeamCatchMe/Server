import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import {
  Body,
  Controller,
  Inject,
  Logger,
  LoggerService,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserNicknamePatchReqDTO } from './dto/user-nickname.patch.req.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Patch()
  async updateNickname(
    // @Token() user: UserDTO,
    @Body() dto: UserNicknamePatchReqDTO,
  ): Promise<ResponseEntity<string>> {
    try {
      await this.userService.updateNickname(1, dto.nickname);
      return ResponseEntity.OK_WITH(rm.UPDATE_USER_SUCCESS);
    } catch (error) {
      this.logger.error(`
        user: ${JSON.stringify('test')},
        dto: ${JSON.stringify(dto)},
        `);
    }
  }
}
