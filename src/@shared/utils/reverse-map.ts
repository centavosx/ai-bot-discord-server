export const reverseMap = <T extends Record<string, number>>(map: T) => {
  return Object.freeze(
    Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k])) as Record<
      number,
      keyof T
    >,
  );
};
