import { PickType } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

export class CharacterCreateRequestDTO extends PickType(CharacterDTO, [
  'name',
  'is_public',
  'type',
]) {}
