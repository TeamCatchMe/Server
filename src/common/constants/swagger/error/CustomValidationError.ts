import { ApiProperty } from '@nestjs/swagger';
import { ValidationError } from '@nestjs/common';
import { Constraint } from './Constraint';

export class CustomValidationError {
  @ApiProperty()
  property: string;

  @ApiProperty({
    type: 'string',
  })
  value: any;

  @ApiProperty({
    type: [Constraint],
  })
  constraints: Constraint[];

  constructor(validationError: ValidationError) {
    this.property = validationError.property;
    this.value =
      validationError.value === undefined ? '' : validationError.value;
    if (validationError.constraints) {
      this.constraints = Object.entries(validationError.constraints).map(
        (obj) => new Constraint(obj),
      );
    }
  }
}
