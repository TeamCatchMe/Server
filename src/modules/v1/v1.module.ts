import { Module } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CharacterModule } from './character/character.module';

@Module({
  imports: [AuthModule, UserModule, ActivityModule, CharacterModule],
})
export class V1Module {}
