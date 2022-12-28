import { AuthType, SocialAuthStrategy } from './auth.type';
import { auth } from '../config/auth.config';

class GoogleAuthStrategy implements SocialAuthStrategy {
  constructor(private readonly auth: auth) {}

  execute(accessToken: string) {
    return this.auth.googleAuth(accessToken);
  }
}

class KakaoAuthStrategy implements SocialAuthStrategy {
  constructor(private readonly auth: auth) {}
  execute(accessToken: string) {
    return this.auth.kakaoAuth(accessToken);
  }
}

class AppleAuthStrategy implements SocialAuthStrategy {
  constructor(private readonly auth: auth) {}
  execute(accessToken: string) {
    return this.auth.appleAuth(accessToken);
  }
}

export const authStrategy: AuthType = {
  kakao: new KakaoAuthStrategy(new auth()),
  apple: new AppleAuthStrategy(new auth()),
  google: new GoogleAuthStrategy(new auth()),
};
