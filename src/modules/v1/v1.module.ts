import { Module } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, ActivityModule],
})
export class V1Module {}
