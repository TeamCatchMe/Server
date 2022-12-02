import { ApiProperty } from '@nestjs/swagger';

export class Constraint {
  @ApiProperty()
  type: string;

  @ApiProperty()
  message: string;

  constructor(constraint: string[]) {
    this.type = constraint[0];
    this.message = constraint[1];
  }
}
