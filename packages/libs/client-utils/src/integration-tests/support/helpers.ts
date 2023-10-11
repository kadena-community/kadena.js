export const withStepFactory = () => {
  let step = 0;
  return <
      Args extends any[],
      Rt extends any,
      T extends (step: number, ...args: Args) => Rt,
    >(
      cb: T,
    ) =>
    (...args: Args): Rt => {
      step += 1;
      return cb(step, ...args);
    };
};
