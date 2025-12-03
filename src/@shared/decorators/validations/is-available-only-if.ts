import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAvailableOnlyIf<T extends object>(
  conditionFn: (obj: T) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      name: 'AvailableOnly',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value, args: ValidationArguments) => {
          const obj = args.object as T;

          if (value !== null && value !== undefined) {
            return conditionFn(obj);
          }

          return true;
        },
        defaultMessage: (args) => {
          if (typeof validationOptions?.message === 'function') {
            return validationOptions.message(args!);
          }

          return (
            validationOptions?.message ||
            `${args?.property} is not allowed in this context`
          );
        },
      },
    });
  };
}
