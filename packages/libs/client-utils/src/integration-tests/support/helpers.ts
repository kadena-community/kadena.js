import type { Any } from '../../core/utils/types';

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
