import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSomeWhere<T = any>(
  predicate: (item: T) => boolean,
  {
    exactlyOne,
    ...rest
  }: ValidationOptions & {
    exactlyOne?: boolean;
  } = {},
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'someWhere',
      target: object.constructor,
      propertyName,
      options: rest,
      validator: {
        validate(value: T[]) {
          if (!Array.isArray(value)) return false;
          if (!value.length) return true; // allow empty array

          const matches = value.filter(predicate).length;

          if (exactlyOne) {
            return matches === 1;
          } else {
            return matches >= 1;
          }
        },
        defaultMessage(args: ValidationArguments) {
          if (rest.message) {
            return typeof rest.message === 'function'
              ? rest.message(args)
              : rest.message;
          }
          const mode = exactlyOne ? 'exactly one' : 'at least one';

          return `Property '${propertyName}' must have ${mode} item satisfying the condition.`;
        },
      },
    });
  };
}
