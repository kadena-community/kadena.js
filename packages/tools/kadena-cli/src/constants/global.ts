import chalk from 'chalk';

export const MULTI_SELECT_INSTRUCTIONS = chalk.yellow(
  `\n  Press ${chalk.green('<space>')} to select, ${chalk.green(
    '<a>',
  )} to toggle all, ${chalk.green('<i>')} to invert selection and ${chalk.green(
    '<enter / return>',
  )} to proceed.`,
);
