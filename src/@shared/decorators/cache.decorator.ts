import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache_request';
export type CacheOptions = {
  ttlInSeconds: number;
  includeQueries?: boolean;
  onSetKey?: (...args: any[]) => string;
};
export const Cache = (options: CacheOptions) => SetMetadata(CACHE_KEY, options);
