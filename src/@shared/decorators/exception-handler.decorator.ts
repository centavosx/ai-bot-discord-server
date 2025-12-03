export const ExceptionHandler = (callback: (error: Error) => void) => {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result.catch(callback);
        }

        return result;
      } catch (err) {
        callback(err);
      }
    };

    return descriptor;
  };
};
