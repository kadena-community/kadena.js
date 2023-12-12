import chalk from 'chalk';
import logUpdate from 'log-update';

type IFrame = string;
const frames: IFrame[] = '◴◷◶◵'.split('');

export const Spinner = () => {
  const elegantSpinner = (): (() => IFrame) => {
    let i = 0;

    return function () {
      return frames[(i = ++i % frames.length)];
    };
  };

  const frame = elegantSpinner();
  let interval;

  return {
    start: () => {
      interval = setInterval(function () {
        logUpdate(chalk.cyan(frame()));
      }, 50);
    },
    stop: () => {
      clearInterval(interval);
      logUpdate.clear();
    },
  };
};
