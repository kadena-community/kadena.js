import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

import { movePages } from './movePages';
import { Spinner } from './spinner';
import type { IBuildReturn } from './types';

export const promiseExec = promisify(exec);
let globalError = false;

const createString = (str: string, start: boolean = false): string => {
  let titleStr = ` END ${chalk.blue(str.toUpperCase())} ====`;
  let line = '\n\n';
  if (start) {
    titleStr = ` START ${chalk.blue(str.toUpperCase())} ====\n\n`;
    line = '';
  }
  const maxLineLength = 70;

  while (line.length + titleStr.length < maxLineLength) {
    line += `=`;
  }

  return `${line}${titleStr}`;
};

const initFunc = async (
  fnc: () => Promise<IBuildReturn>,
  description: string,
): Promise<void> => {
  console.log(createString(description, true));

  const spinner = Spinner();
  spinner.start();

  const { success, errors } = await fnc();

  spinner.stop();

  if (errors.length) {
    errors.map((error) => {
      console.warn(chalk.red('⨯'), error);
    });
    globalError = true;
    process.exitCode = 1;
    return;
  } else {
    success.map((succes) => {
      console.log(chalk.green('✓'), succes);
    });
  }

  console.log(createString(description));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  await initFunc(movePages, 'create foldertree');

  if (globalError) {
    process.exitCode = 1;
  }
})();
