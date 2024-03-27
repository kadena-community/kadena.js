export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fn = (...args: any[]) => unknown;

export type FlattenObject<T extends object> = {
  [K in keyof T]: (x: T[K]) => void;
}[keyof T] extends (x: infer I) => void
  ? { [K in keyof I]: I[K] }
  : never;
