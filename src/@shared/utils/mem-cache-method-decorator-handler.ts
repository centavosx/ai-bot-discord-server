export class MemCacheMethodDecoratorHandler {
  constructor(private readonly value: unknown) {}

  invalidate(...args: unknown[]) {
    (this.value as any).invalidate?.(...args);
  }

  invalidateAll() {
    (this.value as any).invalidateAll?.();
  }
}
