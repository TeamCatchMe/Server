import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const Modules = [UserModule, AuthModule];

const ModulesForVersioning = Modules.map((module) => {
  return { path: 'v1', module };
});

@Module({
  imports: [...Modules, RouterModule.register(ModulesForVersioning)],
})
export class V1Module {}
