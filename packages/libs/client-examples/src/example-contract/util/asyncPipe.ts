type AnyFunc = (...arg: any) => any;

type LastFnReturnType<F extends Array<AnyFunc>> = Last<F> extends (
  ...arg: any
) => infer R
  ? R
  : never;

type First<T extends any[]> = T extends [infer One]
  ? One
  : T extends [infer HD, ...any[]]
  ? HD
  : never;

type Last<T extends any[]> = T extends [infer One]
  ? One
  : T extends [...any, infer LD]
  ? LD
  : never;

type Tail<T extends any[]> = T extends [infer _]
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
      [...Acc, (...arg: IsFirst extends true ? I : [LastReturnType]) => B],
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
      [(...arg: I) => IsLast extends true ? O : LastInputType, ...Acc],
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

interface IPipe {
  <F extends AnyFunc[]>(
    ...fns: F extends PipeArgs<F> ? F : PipeArgs<F>
  ): (...args: Parameters<F[0]>) => LastFnReturnType<F>;
}

export const pipe: IPipe = (...fns: any[]) => {
  const [firstFn, ...restFns] = fns;
  return (...args: any[]) =>
    restFns.reduce((acc, fn) => fn(acc), firstFn(...args));
};

pipe(
  (a: number, b: string) => a + 1,
  (a: number) => 'string',
  <T>(a: T): T => a,
  (a: string) => 3,
);

type Input = [
  (a: number, b: string) => number,
  (a: string) => string,
  <T>(a: T) => T,
  <T>(a: T) => T,
  (a: number) => number,
];

type Args = PipeArgsWithCorrection<
  PipeArgsTopToDown<Input>,
  PipeArgsDownToTop<Input>
>;

type Z = (<T>(a: T) => T) extends (a: string) => infer R ? R : false;
