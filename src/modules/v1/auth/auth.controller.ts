import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { AuthLoginSuccess } from '@common/constants/swagger/domain/auth/AuthLoginSuccess';
import { AuthSignupSuccess } from '@common/constants/swagger/domain/auth/AuthSignupSuccess';
import { AuthTokenGetAccepted } from '@common/constants/swagger/domain/auth/AuthTokenGetAccepted';
import { AuthTokenGetSuccess } from '@common/constants/swagger/domain/auth/AuthTokenGetSuccess';
import { BadRequestError } from '@common/constants/swagger/error/BadRequestError';
import { ConflictError } from '@common/constants/swagger/error/ConflictError';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { NotFoundError } from '@common/constants/swagger/error/NotFoundError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  LoggerService,
  Post,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginRequestDTO } from './dto/auth-login.req.dto';
import { AuthSignupRequestDTO } from './dto/auth-signup.req.dto';
import { AuthTokenGetHeaderDTO } from './dto/auth-token-get.header.dto';
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

  //todo 로그인
  @ApiOperation({
    summary: '로그인을 진행합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '로그인에 성공했습니다.',
    type: AuthLoginSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiConflictResponse({
    description: '존재하지 않는 유저입니다.',
    type: NotFoundError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Post('/login')
  async login(
    @Body() body: AuthLoginRequestDTO,
  ): Promise<ResponseEntity<AuthResponseDTO>> {
    const uuid = await this.authService.getUuidFromSocialToken(
      body.provider,
      body.token,
    );

    const data = await this.authService.login(uuid);
    return ResponseEntity.OK_WITH_DATA(rm.SIGNIN_SUCCESS, data);
  }

  //todo 토큰 재발급
  @ApiOperation({
    summary: '토큰 재발급',
    description: `
    access 토큰과 refresh 토큰이 모두 만료된 경우에 토큰을 재발급 합니다. \n
    토큰이 유효한 경우엔 202를 출력합니다. \n
    헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다. \n
    `,
  })
  @ApiOkResponse({
    description: '토큰 재발급 성공',
    type: AuthTokenGetSuccess,
  })
  @ApiAcceptedResponse({
    description: '토큰이 유효한 경우 Accepted 처리됩니다.',
    type: AuthTokenGetAccepted,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청 값입니다.',
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
    description: '유효하지 않은 유저 / 토큰입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Get('/token')
  async refreshToken(@Headers() header: AuthTokenGetHeaderDTO) {
    const data = await this.authService.renewalToken(
      header.accesstoken,
      header.refreshtoken,
    );
    if (!data) return ResponseEntity.ACCEPTED_WITH(rm.VALID_TOKEN);
    return ResponseEntity.OK_WITH_DATA(rm.CREATE_TOKEN_SUCCESS, data);
  }

  //todo 회원 탈퇴
}
