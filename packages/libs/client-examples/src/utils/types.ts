// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type AnyFunc = (...arg: Any) => Any;

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

export type First<T extends Any[]> = T extends [infer One]
  ? One
  : T extends [infer HD, ...Any[]]
  ? HD
  : never;

export type Tail<T extends Any[]> = T extends [infer _]
  ? []
  : T extends [infer _, ...infer TL]
  ? TL
  : never;
