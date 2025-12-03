export const tryCatch = async <ErrorResponse, TryResponse = unknown>(
  tryer: (() => TryResponse) | (() => Promise<TryResponse>),
): Promise<[Awaited<TryResponse | null>, ErrorResponse | null]> => {
  try {
    const result = await Promise.resolve(tryer());
    return [result, null];
  } catch (error) {
    return [null, error as ErrorResponse];
  }
};
