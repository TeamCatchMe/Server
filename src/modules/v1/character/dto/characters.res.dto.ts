import { PickType } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

export class CharactersResponseDTO extends PickType(CharacterDTO, [
  'id',
  'name',
  'type',
  'level',
]) {}
