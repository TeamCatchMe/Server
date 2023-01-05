import { Controller, Inject, Logger, LoggerService } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  //todo 소셜 회원가입 및 로그인
  //todo 토큰 재발급
  //todo 회원 탈퇴
}
