import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsUUID } from 'class-validator';
import { QueryArray } from './query-array';

export const MultipleQueryUuids = () => {
  return applyDecorators(
    IsArray(),
    IsUUID(undefined, { each: true }),
    Type(() => String),
    QueryArray(),
  );
};
