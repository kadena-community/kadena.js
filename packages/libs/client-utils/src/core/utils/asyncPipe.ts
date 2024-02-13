import type { IAsyncPipe } from '../../interfaces/async-pipe-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/**
 * @public
 */
export const asyncPipe: IAsyncPipe = (
  first: (...i: Any[]) => Any,
  ...fns: { (i: Any, input: Any): Any; startPoint?: any }[]
) =>
  ((...value: Any[]) => {
    const start = fns.findIndex((fn) => 'startPoint' in fn);
    let fnsList = fns;
    let startData = value;
    if (start !== -1) {
      fnsList = fns.slice(start + 1);
      startData = [fns[start].startPoint];
    }
    return fnsList.reduce(
      (acc, fn) => acc.then((data) => fn(data, value)),
      Promise.resolve(first(...startData)),
    );
  }) as Any;
