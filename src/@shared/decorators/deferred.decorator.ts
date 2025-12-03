import { Deferred as DeferredInstance } from '../utils/deferred';

export function Deferred(
  onSetKey: (...args: any[]) => string,
): MethodDecorator {
  const runningDeferredMap = new Map<string, DeferredInstance<any>>();

  return function (_, __, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const currentKey = onSetKey.apply(this, args);

      const currentDeferred = runningDeferredMap.get(currentKey);

      if (currentDeferred) {
        return await currentDeferred.promise;
      }

      const deferred = new DeferredInstance<unknown>();

      runningDeferredMap.set(currentKey, deferred);

      try {
        const result = await originalMethod.apply(this, args);
        deferred.resolve(result);
        return result;
      } catch (err) {
        deferred.reject(err);
        throw err;
      } finally {
        runningDeferredMap.delete(currentKey);
      }
    };

    return descriptor;
  };
}
