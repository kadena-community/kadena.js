import chalk from 'chalk';
import logUpdate from 'log-update';

export const Spinner = () => {
  const elegantSpinner = () => {
    var i = 0;

    return function () {
      return frames[(i = ++i % frames.length)];
    };
  };

  var frame = elegantSpinner();
  let interval;
  const frames = '◴◷◶◵'.split('');

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
