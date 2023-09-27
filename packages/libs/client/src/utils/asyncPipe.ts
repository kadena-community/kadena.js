// Strongly typed function primitives

// pipe method overloads based on:
// https://github.com/biggyspender/ts-functional-pipe/blob/master/src/pipe.ts

// Other solutions considered:

// 1. A complex recursive type implementation
// https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h
// Failed when operators used generics

// 2. Builder pattern
// https://stackoverflow.com/a/75907318
// Decided against this because it's not the expected syntax

type Func<I extends unknown[], O> = (...args: I) => O;
type UnaryFunction<I, O> = (arg: Awaited<I>) => O;
type Output<T> = T extends Promise<unknown> ? T : Promise<T>;

/**
 * pipe async functions together, this is general pursue function but as its helpful for composing the client functions specially in FP style, we have it here.
 * @example
 * const submit = asyncPipe(
 *  getCommand,
 *  createTransaction,
 *  sign,
 *  submit,
 * );
 *
 * @alpha
 */
interface IAsyncPipeOverload {
  <TIn extends unknown[], TOut>(op1: Func<TIn, TOut>): Func<TIn, TOut>;
  <TIn extends unknown[], T1, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, T6, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, T6>,
    op7: UnaryFunction<T6, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, T6, T7, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, T6>,
    op7: UnaryFunction<T6, T7>,
    op8: UnaryFunction<T7, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, T6, T7, T8, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, T6>,
    op7: UnaryFunction<T6, T7>,
    op8: UnaryFunction<T7, T8>,
    op9: UnaryFunction<T8, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, T6, T7, T8, T9, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, T6>,
    op7: UnaryFunction<T6, T7>,
    op8: UnaryFunction<T7, T8>,
    op9: UnaryFunction<T8, T9>,
    op10: UnaryFunction<T9, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, T6>,
    op7: UnaryFunction<T6, T7>,
    op8: UnaryFunction<T7, T8>,
    op9: UnaryFunction<T8, T9>,
    op10: UnaryFunction<T9, T10>,
    op11: UnaryFunction<T10, TOut>,
  ): (...args: TIn) => Output<TOut>;
  <TIn extends unknown[], T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, TOut>(
    op1: Func<TIn, T1>,
    op2: UnaryFunction<T1, T2>,
    op3: UnaryFunction<T2, T3>,
    op4: UnaryFunction<T3, T4>,
    op5: UnaryFunction<T4, T5>,
    op6: UnaryFunction<T5, T6>,
    op7: UnaryFunction<T6, T7>,
    op8: UnaryFunction<T7, T8>,
    op9: UnaryFunction<T8, T9>,
    op10: UnaryFunction<T9, T10>,
    op11: UnaryFunction<T10, T11>,
    op12: UnaryFunction<T11, TOut>,
  ): (...args: TIn) => Output<TOut>;
}

/**
 * @public
 */
export const asyncPipe: IAsyncPipeOverload =
  (first: (...i: unknown[]) => unknown, ...fns: ((i: unknown) => unknown)[]) =>
  (...value: unknown[]) => {
    return fns.reduce(
      (acc, fn) => acc.then(fn),
      Promise.resolve(first(...value)),
    );
  };
