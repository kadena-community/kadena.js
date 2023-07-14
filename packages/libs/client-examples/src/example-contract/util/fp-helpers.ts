// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
type all = any;

// pipe async functions
export const asyncPipe =
  (...args: Array<(arg: all) => all>): ((init: all) => Promise<all>) =>
  (init: all): Promise<all> =>
    args.reduce((chian, fn) => chian.then(fn), Promise.resolve(init));

export const head = (args: all[]): any => args[0];
