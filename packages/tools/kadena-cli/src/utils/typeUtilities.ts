// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type First<T extends any[]> = T extends [infer One]
  ? One
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends [infer HD, ...any[]]
  ? HD
  : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export type Tail<T extends any[]> = T extends [infer _]
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends [infer _, ...infer TL]
  ? TL
  : never;

/** @deprecated use Awaited instead */
export type Pure<T> = T extends Promise<infer R> ? R : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Combine2<A, B> = {
  [K in keyof (A | B)]: A[K] | B[K];
} & Omit<A, keyof B> &
  Omit<B, keyof A>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fn = (...args: any[]) => unknown;
