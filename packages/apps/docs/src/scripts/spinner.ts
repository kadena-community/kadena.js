import chalk from 'chalk';
import logUpdate from 'log-update';

interface ISpinner {
  start: () => void;
  stop: () => void;
}

interface IElegantSpinner {
  (): string;
}

export const Spinner = (): ISpinner => {
  const frames = '◴◷◶◵'.split('');

  const elegantSpinner = (): IElegantSpinner => {
    let i = 0;

    return function () {
      return frames[(i = ++i % frames.length)];
    };
  };

  const frame = elegantSpinner();
  let interval: NodeJS.Timeout;

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
