import { Inject, Injectable } from '@nestjs/common';
import { AuthRepositoryInterface, AUTH_REPOSITORY } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryInterface,
  ) {}
}
