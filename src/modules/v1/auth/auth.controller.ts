import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { AuthSignupSuccess } from '@common/constants/swagger/domain/auth/AuthSignupSuccess';
import { ConflictError } from '@common/constants/swagger/error/ConflictError';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import {
  Body,
  Controller,
  Inject,
  Logger,
  LoggerService,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignupRequestDTO } from './dto/auth-signup.req.dto';
import { AuthResponseDTO } from './dto/auth.res.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  //todo 소셜 회원가입
  @ApiOperation({
    summary: '회원가입을 진행합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '회원가입에 성공했습니다.',
    type: AuthSignupSuccess,
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
  @Post('/signup')
  async signup(
    @Body() body: AuthSignupRequestDTO,
  ): Promise<ResponseEntity<AuthResponseDTO>> {
    const uuid = await this.authService.getUuidFromSocialToken(
      body.provider,
      body.token,
    );

    const data = await this.authService.signup(
      body.provider,
      uuid,
      body.nickname,
    );

    return ResponseEntity.CREATED_WITH_DATA(rm.SIGNUP_SUCCESS, data);
  }

  //todo 토큰 재발급
  //todo 회원 탈퇴
}
