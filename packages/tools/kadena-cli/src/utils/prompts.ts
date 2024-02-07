import * as inquirer from '@inquirer/prompts';
import type ttys from 'ttys';

interface INQUIREROPTIONS {
  input: typeof ttys.stdin;
  output: typeof process.stderr;
}

let cache: INQUIREROPTIONS;

const getInquirerOptions = async (): Promise<INQUIREROPTIONS> => {
  if (cache !== undefined) return cache;
  // eslint-disable-next-line require-atomic-updates
  cache = {
    input: (await import('ttys')).stdin,
    output: process.stderr,
  };
  return cache;
};

export const checkbox: typeof inquirer.checkbox = (async (config, context) =>
  inquirer.checkbox(config, {
    ...context,
    ...(await getInquirerOptions()),
  })) as typeof inquirer.checkbox;

export const input: typeof inquirer.input = (async (config, context) =>
  inquirer.input(config, {
    ...context,
    ...(await getInquirerOptions()),
  })) as typeof inquirer.input;

export const select: typeof inquirer.select = (async (config, context) =>
  inquirer.select(config, {
    ...context,
    ...(await getInquirerOptions()),
  })) as typeof inquirer.select;

export const password: typeof inquirer.password = (async (config, context) =>
  inquirer.password(config, {
    ...context,
    ...(await getInquirerOptions()),
  })) as typeof inquirer.password;
