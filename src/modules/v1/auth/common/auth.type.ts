export interface SocialAuthStrategy {
  execute(accessToken: string): Promise<string>;
}

export enum AUTH {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export type SocialPlatform = 'kakao' | 'apple' | 'google' | 'naver';

export type AuthType = {
  [social in SocialPlatform]: SocialAuthStrategy;
};
