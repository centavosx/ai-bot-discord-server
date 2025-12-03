export const batchCall = async <T, R = T>({
  value,
  batchCount,
  onMap,
  onValidate,
  onBatched,
}: {
  value: T[];
  batchCount: number;
  onMap?: (value: T) => R;
  onValidate?: (value: Awaited<R>) => boolean;
  onBatched?: (value: Awaited<R>[]) => unknown;
}): Promise<Awaited<R>[]> => {
  const result: Awaited<R>[] = [];

  while (value.length) {
    const targetData = value.splice(0, batchCount);
    let batchedResults = targetData as (Awaited<T> | Awaited<R>)[];

    if (onMap) {
      batchedResults = await Promise.all(
        targetData.map((value) => {
          return onMap?.(value);
        }),
      );
    }

    if (onValidate) {
      batchedResults = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/await-thenable
        batchedResults.filter((value) => {
          return onValidate?.(value as Awaited<R>);
        }),
      );
    }

    if (onBatched) {
      await onBatched?.(batchedResults as Awaited<R>[]);
    }

    result.push(...(batchedResults as Awaited<R>[]));
  }

  return result;
};
