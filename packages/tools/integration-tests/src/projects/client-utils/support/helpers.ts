
//TODO: Ask Javad if we should export types from @kadena/client-utils. Duplicated type for now to prevent changing the client-utils API.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export const withStepFactory = () => {
  let step = 0;
  return <
      Args extends Any[],
      Rt extends Any,
      T extends (step: number, ...args: Args) => Rt,
    >(
      cb: T,
    ) =>
    (...args: Args): Rt => {
      step += 1;
      return cb(step, ...args);
    };
};
