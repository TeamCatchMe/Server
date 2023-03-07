import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { AuthLoginAccepted } from '@common/constants/swagger/domain/auth/AuthAcceptedSuccess';
import { AuthLoginSuccess } from '@common/constants/swagger/domain/auth/AuthLoginSuccess';
import { AuthSignupSuccess } from '@common/constants/swagger/domain/auth/AuthSignupSuccess';
import { AuthTokenGetAccepted } from '@common/constants/swagger/domain/auth/AuthTokenGetAccepted';
import { AuthTokenGetSuccess } from '@common/constants/swagger/domain/auth/AuthTokenGetSuccess';
import { AuthWithdrawSuccess } from '@common/constants/swagger/domain/auth/AuthWithdrawSuccess';
import { BadRequestError } from '@common/constants/swagger/error/BadRequestError';
import { ConflictError } from '@common/constants/swagger/error/ConflictError';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { NotFoundError } from '@common/constants/swagger/error/NotFoundError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import { Token } from '@common/decorators/token.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { routesV1 } from '@config/routes.config';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDTO } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthLoginRequestDTO } from './dto/auth-login.req.dto';
import { AuthSignupRequestDTO } from './dto/auth-signup.req.dto';
import { AuthTokenGetHeaderDTO } from './dto/auth-token-get.header.dto';
import { AuthResponseDTO } from './dto/auth.res.dto';

@ApiTags('Auth API')
@Controller(routesV1.version)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입을 진행합니다.',
    description: `
    Request Body 중
    provider는 카카오, 애플 등 가입한 소셜 플랫폼 경로를,
    token은 해당 provider에서 얻은 소셜 토큰을 알맞게 입력해주시면 됩니다.

    ✔️ 유효하지 않는 토큰에는 Exception이 발생합니다.
    `,
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
  @Post(routesV1.auth.signup)
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

  @ApiOperation({
    summary: '로그인을 진행합니다.',
    description: `
    provider는 카카오, 애플 등 가입한 소셜 플랫폼 경로를,
    token은 해당 provider에서 얻은 소셜 토큰을 알맞게 입력해주시면 됩니다.

    ✔️ 유효하지 않는 토큰에는 Exception이 발생합니다.
    ✔️ 토큰은 유효하지만 회원가입이 필요한 유저라면 202 Accepted로 응답합니다.
    `,
  })
  @ApiOkResponse({
    description: '로그인에 성공했습니다.',
    type: AuthLoginSuccess,
  })
  @ApiAcceptedResponse({
    description: '토큰은 유효하지만 가입하지 않은 유저입니다.',
    type: AuthLoginAccepted,
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
  @Post(routesV1.auth.signin)
  async login(
    @Body() body: AuthLoginRequestDTO,
  ): Promise<ResponseEntity<AuthResponseDTO | string>> {
    const uuid = await this.authService.getUuidFromSocialToken(
      body.provider,
      body.token,
    );

    const data = await this.authService.login(uuid);

    if (!data) return ResponseEntity.ACCEPTED_WITH(rm.SIGNIN_ACCEPTED);
    return ResponseEntity.OK_WITH_DATA(rm.SIGNIN_SUCCESS, data);
  }

  @ApiOperation({
    summary: '토큰 재발급',
    description: `
    access 토큰과 refresh 토큰이 모두 만료된 경우에 토큰을 재발급 합니다. \n
    
    ✔️ 토큰이 유효한 경우엔 202를 출력합니다. \n
    ✔️ 헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다. \n
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
  @Get(routesV1.auth.token)
  async refreshToken(@Headers() header: AuthTokenGetHeaderDTO) {
    const data = await this.authService.renewalToken(
      header.accesstoken,
      header.refreshtoken,
    );
    if (!data) return ResponseEntity.ACCEPTED_WITH(rm.VALID_TOKEN);
    return ResponseEntity.OK_WITH_DATA(rm.CREATE_TOKEN_SUCCESS, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원 탈퇴',
    description: `
    UserId를 받아 해당하는 유저를 삭제합니다.
    
    ✔️ 존재하지 않는 유저의 id를 요청하면 404 에러를 출력합니다.
    ✔️ 헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다.
    `,
  })
  @ApiOkResponse({
    description: '회원 탈퇴 성공',
    type: AuthWithdrawSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저의 id입니다.',
    type: NotFoundError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류입니다.',
    type: InternalServerError,
  })
  @Delete(routesV1.auth.withdraw)
  @ApiBearerAuth('Authorization')
  async deleteUser(@Token() user: UserDTO) {
    await this.authService.withdraw(user.id);
    return ResponseEntity.OK_WITH(rm.DELETE_USER_SUCCESS);
  }
}
