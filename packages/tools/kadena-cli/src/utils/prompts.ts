import * as inquirer from '@inquirer/prompts';
import ttys from 'ttys';

export const INQUIRER_OPTIONS = {
  input: ttys.stdin,
  output: process.stderr,
};

export const checkbox: typeof inquirer.checkbox = (config, context) =>
  inquirer.checkbox(config, { ...context, ...INQUIRER_OPTIONS });

export const input: typeof inquirer.input = (config, context) =>
  inquirer.input(config, { ...context, ...INQUIRER_OPTIONS });

export const select: typeof inquirer.select = (config, context) =>
  inquirer.select(config, { ...context, ...INQUIRER_OPTIONS });

export const password: typeof inquirer.password = (config, context) =>
  inquirer.password(config, { ...context, ...INQUIRER_OPTIONS });
