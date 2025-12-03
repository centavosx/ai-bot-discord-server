import { Deferred } from './deferred';

describe('Deferred', () => {
  it('should create a promise that can be resolved externally', async () => {
    const deferred = new Deferred<number>();

    expect(deferred.promise).toBeInstanceOf(Promise);
    expect(typeof deferred.resolve).toBe('function');
    expect(typeof deferred.reject).toBe('function');

    setTimeout(() => deferred.resolve(42), 10);

    const result = await deferred.promise;
    expect(result).toBe(42);
  });

  it('should reject externally', async () => {
    const deferred = new Deferred<string>();
    const error = new Error('Something went wrong');

    setTimeout(() => deferred.reject(error), 10);

    await expect(deferred.promise).rejects.toThrow('Something went wrong');
  });

  it('should resolve synchronously if resolve called before awaiting', async () => {
    const deferred = new Deferred<boolean>();
    deferred.resolve(true);

    await expect(deferred.promise).resolves.toBe(true);
  });

  it('should allow multiple awaits on same resolved promise', async () => {
    const deferred = new Deferred<number>();
    deferred.resolve(99);

    const results = await Promise.all([
      deferred.promise,
      deferred.promise,
      deferred.promise,
    ]);

    expect(results).toEqual([99, 99, 99]);
  });
});
