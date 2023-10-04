import type { IAsyncPipe } from '../interfaces/async-pipe-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/**
 * @public
 */
export const asyncPipe: IAsyncPipe = (
  first: (...i: Any[]) => Any,
  ...fns: ((i: Any) => Any)[]
) =>
  ((...value: Any[]) => {
    return fns.reduce(
      (acc, fn) => acc.then(fn),
      Promise.resolve(first(...value)),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
