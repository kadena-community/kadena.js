type AnyFunc = (...arg: any) => any;

type LastFnReturnType<F extends Array<AnyFunc>> = Last<F> extends (
  ...arg: any
) => infer R
  ? R
  : never;

export type First<T extends any[]> = T extends [infer One]
  ? One
  : T extends [infer HD, ...any[]]
  ? HD
  : never;

type Last<T extends any[]> = T extends [infer One]
  ? One
  : T extends [...any, infer LD]
  ? LD
  : never;

export type Tail<T extends any[]> = T extends [infer _]
  ? []
  : T extends [infer _, ...infer TL]
  ? TL
  : never;

type HEAD<T extends any[]> = T extends [infer _]
  ? []
  : T extends [...infer HD, infer _]
  ? HD
  : never;

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

type IfUnknown<T, Y, N> = IfAny<T, N, unknown extends T ? Y : N>;

type PipeArgsTopToDown<
  Unprocessed extends AnyFunc[],
  LastReturnType = any,
  Acc extends AnyFunc[] = [],
  IsFirst = true,
> = Unprocessed extends []
  ? Acc
  : First<Unprocessed> extends (...arg: infer I) => infer B
  ? PipeArgsTopToDown<
      Tail<Unprocessed> extends AnyFunc[] ? Tail<Unprocessed> : [],
      B,
      [
        ...Acc,
        (...arg: IsFirst extends true ? I : [Awaited<LastReturnType>]) => B,
      ],
      false
    >
  : Acc;

type PipeArgsDownToTop<
  Unprocessed extends AnyFunc[],
  LastInputType = never,
  Acc extends AnyFunc[] = [],
  IsLast = true,
> = Unprocessed extends []
  ? Acc
  : Last<Unprocessed> extends (...arg: infer I) => infer O
  ? PipeArgsDownToTop<
      HEAD<Unprocessed> extends AnyFunc[] ? HEAD<Unprocessed> : [],
      I[0],
      [
        (
          ...arg: I
        ) => IsLast extends true ? O : Promise<LastInputType> | LastInputType,
        ...Acc,
      ],
      false
    >
  : Acc;

type CorrectUnknownType<A, B, IsFirst> = IsFirst extends true
  ? A extends AnyFunc
    ? A
    : never
  : A extends (arg: infer AI) => infer AO
  ? B extends (arg: infer BI) => infer BO
    ? (arg: IfUnknown<AI, BI, AI>) => IfUnknown<AO, BO, AO>
    : never
  : never;

type PipeArgsWithCorrection<
  F extends AnyFunc[],
  S extends AnyFunc[],
  Processed extends AnyFunc[] = [],
  IsFirst = true,
> = F extends []
  ? Processed
  : PipeArgsWithCorrection<
      Tail<F> extends AnyFunc[] ? Tail<F> : [],
      Tail<S> extends AnyFunc[] ? Tail<S> : [],
      [...Processed, CorrectUnknownType<First<F>, First<S>, IsFirst>],
      false
    >;

type PipeArgs<F extends AnyFunc[]> = PipeArgsWithCorrection<
  PipeArgsTopToDown<F>,
  PipeArgsDownToTop<F>
>;

interface IAsyncPipe {
  <F extends AnyFunc[]>(
    ...fns: F extends PipeArgs<F> ? F : PipeArgs<F>
  ): {
    fns: F;
    (
      ...args: Parameters<F[0]>
    ): LastFnReturnType<F> extends Promise<any>
      ? LastFnReturnType<F>
      : Promise<LastFnReturnType<F>>;
  };
}

export const asyncPipe: IAsyncPipe = (...fns: any[]) => {
  const [firstFn, ...restFns] = fns;
  return (...args: any[]) =>
    restFns.reduce((acc, fn) => fn(acc), firstFn(...args));
};

asyncPipe(
  (a: number, b: string) => Promise.resolve(a + 1),
  (a: number) => Promise.resolve('string'),
  <T>(a: T): T => a,
  (a: string) => 3,
);
