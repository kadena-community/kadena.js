// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type AnyFunc = (...arg: Any[]) => Any;

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

export type First<T extends Any[]> = T extends [infer One]
  ? One
  : T extends [infer HD, ...Any[]]
    ? HD
    : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Tail<T extends Any[]> = T extends [infer _]
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends [infer _, ...infer TL]
    ? TL
    : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Assert<T, U> =
  (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
    ? true
    : { error: 'Types are not equal'; received: T; expected: U };

export type UnionToIntersection<T> = (
  T extends unknown ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;
