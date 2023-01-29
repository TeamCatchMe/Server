import { PickType } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

export class CharacterEditRequestDTO extends PickType(CharacterDTO, [
  'id',
  'name',
  'is_public',
]) {}
