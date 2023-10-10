import type { IAsyncPipe } from '../interfaces/async-pipe-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/**
 * @public
 */
export const asyncPipe: IAsyncPipe = (
  first: (...i: Any[]) => Any,
  ...fns: ((i: Any, input: Any) => Any)[]
) =>
  ((...value: Any[]) => {
    return fns.reduce(
      (acc, fn) => acc.then((data) => fn(data, value)),
      Promise.resolve(first(...value)),
    );
  }) as Any;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const returnInput = <T>(_: Any, input: [T]): T =>
  Array.isArray(input) ? input[0] : input;
