export interface SocialAuthStrategy {
  execute(accessToken: string): Promise<string>;
}

export type SocialPlatform = 'kakao' | 'apple' | 'google';

export type AuthType = {
  [social in SocialPlatform]: SocialAuthStrategy;
};
