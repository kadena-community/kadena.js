import chalk from 'chalk';

export const MULTI_SELECT_INSTRUCTIONS = chalk.yellow(
  `\n  Press ${chalk.green('<space>')} to select, ${chalk.green(
    '<a>',
  )} to toggle all, ${chalk.green('<i>')} to invert selection and ${chalk.green(
    '<enter / return>',
  )} to proceed.`,
);

export const INVALID_FILE_NAME_ERROR_MSG =
  'Do not use these characters: \\ / : * ? " < > |. Please choose a different name without these characters';
