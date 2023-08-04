// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
type all = any;

// pipe async functions
export const asyncPipe =
  (...args: Array<(arg: all) => all>): ((init: all) => Promise<all>) =>
  (init: all): Promise<all> =>
    args.reduce((chain, fn) => chain.then(fn), Promise.resolve(init));

export const head = (args: all[]): any => args[0];

export const inspect =
  (tag: string): (<T extends unknown>(data: T) => T) =>
  <T extends any>(data: T): T => {
    console.log(tag, data);
    return data;
  };
