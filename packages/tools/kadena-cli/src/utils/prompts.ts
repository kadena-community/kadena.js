import * as inquirer from '@inquirer/prompts';
import type ttys from 'ttys';

interface IInquirerOptions {
  input: typeof ttys.stdin;
  output: typeof process.stderr;
}

const getInquirerOptions = async (): Promise<IInquirerOptions> => {
  return {
    input: (await import('ttys').catch(() => process)).stdin,
    output: process.stderr,
  };
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
