import { applyDecorators } from '@nestjs/common';
import { Validate } from 'class-validator';
import { GreaterThanValidation } from '../../validators/greater-than.validator';

export const IsGreaterThan = (key: string | number) => {
  return applyDecorators(Validate(GreaterThanValidation, [key]));
};
