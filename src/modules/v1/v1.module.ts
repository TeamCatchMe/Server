import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CharacterModule } from './character/character.module';

const Modules = [UserModule, AuthModule, CharacterModule];

const ModulesForVersioning = Modules.map((module) => {
  return { path: 'v1', module };
});

@Module({
  imports: [...Modules, RouterModule.register(ModulesForVersioning)],
})
export class V1Module {}
