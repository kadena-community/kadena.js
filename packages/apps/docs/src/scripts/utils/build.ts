import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Spinner } from '../spinner';
import type { IScriptResult } from '../types';
import { setGlobalError } from './globalError';

export const promiseExec = promisify(exec);
export const TEMP_DIR = './.tempimport';

export const createString = (str: string, start?: boolean): string => {
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

export const initFunc = async (
  fnc: () => Promise<IScriptResult>,
  description: string,
  globalError = false,
): Promise<void | number> => {
  console.log(createString(description, true));

  const spinner = Spinner();
  spinner.start();

  const { success, errors } = await fnc();

  spinner.stop();

  if (errors.length) {
    errors.map((error) => {
      console.warn(chalk.red('⨯'), error);
    });
    console.warn(chalk.red(`there were ${errors.length} errors`));
    setGlobalError(true);
  } else {
    success.map((succes) => {
      console.log(chalk.green('✓'), succes);
    });
  }

  console.log(createString(description));
};
