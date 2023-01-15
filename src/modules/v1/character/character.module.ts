import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService]
})
export class CharacterModule {}
