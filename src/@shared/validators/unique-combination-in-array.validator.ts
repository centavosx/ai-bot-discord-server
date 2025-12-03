/* eslint-disable @typescript-eslint/no-wrapper-object-types */

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueCombinationInArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) return true;

    const keys = args.constraints as string[];
    const seen = new Set<string>();

    for (const item of value) {
      if (!item) continue;

      const key = keys.map((k) => item[k]).join('|');

      if (seen.has(key)) return false;
      seen.add(key);
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const keys = args.constraints as string[];
    return `Duplicate combination found for fields: ${keys.join(', ')}`;
  }
}
