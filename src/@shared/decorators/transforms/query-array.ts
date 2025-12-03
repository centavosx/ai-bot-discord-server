import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export const QueryArray = () => {
  return applyDecorators(
    IsArray(),
    Type(() => String),
    Transform(({ value }) =>
      Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? value.split(',').map((v) => v.trim())
          : [],
    ),
  );
};
