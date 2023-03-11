import { PickType } from '@nestjs/swagger';
import { CharacterDTO } from './character.dto';

export class CharacterGetSpecificDateResponseDTO extends PickType(
  CharacterDTO,
  ['id', 'name', 'type', 'level'],
) {}
