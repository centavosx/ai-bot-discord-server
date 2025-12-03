export type ClassToRecord<T extends object> = {
  [K in keyof T]: T[K] extends object ? ClassToRecord<T[K]> : T[K];
};
