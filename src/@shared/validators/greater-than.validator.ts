import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class GreaterThanValidation implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [minKey] = args.constraints;
    const minValue = typeof minKey === 'number' ? minKey : args.object[minKey];
    if (minValue === undefined || value === undefined) return true;
    return +value > +minValue;
  }

  defaultMessage(args: any) {
    const [minKey] = args.constraints;
    return `${args.property} must be greater than ${minKey}`;
  }
}
