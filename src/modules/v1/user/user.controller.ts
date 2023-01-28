import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { UserDuplicateCheckSuccess } from '@common/constants/swagger/domain/user/UserDuplicateCheckSuccess';
import { UserPatchNicknameSuccess } from '@common/constants/swagger/domain/user/UserPatchNicknameSuccess';
import { ConflictError } from '@common/constants/swagger/error/ConflictError';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import { Token } from '@common/decorators/token.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { routesV1 } from '@config/routes.config';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserNicknamePatchReqDTO } from './dto/user-nickname.patch.req.dto';
import { UserPatchNicknameResponseDTO } from './dto/user-nickname.patch.res.dto';
import { UserNicknameQueryDTO } from './dto/user-nickname.query.dto';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller(routesV1.version)
@ApiTags('User API')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //todo 닉네임 변경
  @ApiOperation({
    summary: '닉네임을 변경합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '닉네임 변경에 성공했습니다.',
    type: UserPatchNicknameSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiConflictResponse({
    description: '이미 사용중인 닉네임입니다.',
    type: ConflictError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Patch(routesV1.user.nickname)
  async updateNickname(
    @Token() user: UserDTO,
    @Body() dto: UserNicknamePatchReqDTO,
  ): Promise<ResponseEntity<UserPatchNicknameResponseDTO>> {
    const data = await this.userService.updateNickname(user.id, dto.nickname);
    return ResponseEntity.OK_WITH_DATA(rm.UPDATE_USER_SUCCESS, data);
  }

  //todo 닉네임 중복체크
  @ApiOperation({
    summary: '닉네임 중복 체크를 진행합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '닉네임 중복 체크에 성공했습니다.',
    type: UserDuplicateCheckSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiConflictResponse({
    description: '이미 사용중인 닉네임입니다.',
    type: ConflictError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Get(routesV1.user.nickname_check)
  async checkDuplicateNickname(
    @Query() query: UserNicknameQueryDTO,
  ): Promise<ResponseEntity<string>> {
    const data = await this.userService.checkDuplicateNickname(query.nickname);
    if (!data) throw new InternalServerErrorException(rm.INTERNAL_SERVER_ERROR);
    return ResponseEntity.OK_WITH(rm.CHECK_USER_NAME_SUCCESS);
  }
}
