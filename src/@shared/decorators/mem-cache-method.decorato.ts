import { Deferred } from '../utils/deferred';

export function MemCacheMethod(
  onSetKey?: (...args: any[]) => string,
): MethodDecorator {
  const keyPrefix = onSetKey ? 'memcache:' : 'memcache:nokey:';

  const cacheMap = new Map<
    string,
    { cached: unknown; deferred: Deferred<unknown> | null }
  >();
  const getKey = (...args: any[]) => `${keyPrefix}${onSetKey?.(...args) ?? ''}`;

  return function (target, __, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = getKey(...args);
      let entry = cacheMap.get(key);

      if (entry?.cached !== undefined) {
        return entry.cached;
      }

      if (entry?.deferred) {
        return entry.deferred.promise;
      }

      const deferred = new Deferred<unknown>();
      entry = { cached: undefined, deferred };
      cacheMap.set(key, entry);

      try {
        const result = await originalMethod.apply(this, args);
        entry.cached = result;
        entry.deferred = null;
        deferred.resolve(result);
        return result;
      } catch (error) {
        deferred.reject(error);
        cacheMap.delete(key);
        throw error;
      }
    };

    descriptor.value.invalidate = (...args: any[]) => {
      const key = getKey(...args);
      cacheMap.delete(key);
    };

    descriptor.value.invalidateAll = () => cacheMap.clear();

    return descriptor;
  };
}
