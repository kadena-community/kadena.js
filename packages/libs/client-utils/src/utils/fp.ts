// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
type all = any;

/**
 * @internal
 */
export const asyncPipe =
  (...args: Array<(arg: all) => all>): ((init: all) => Promise<all>) =>
  (init: all): Promise<all> =>
    args.reduce((chain, fn) => chain.then(fn), Promise.resolve(init));

/**
 * @internal
 */
export const head = (args: all[]): any => args[0];

/**
 * @internal
 */
export const inspect =
  (tag: string): (<T extends unknown>(data: T) => T) =>
  <T extends any>(data: T): T => {
    console.log(tag, data);
    return data;
  };
