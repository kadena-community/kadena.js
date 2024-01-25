import chalk from 'chalk';
import type { Ora } from 'ora';

interface ICommandError {
  success: false;
  errors: string[];
  warnings?: string[];
}
interface ICommandSuccess<T> {
  success: true;
  warnings?: string[];
  data: T;
}
export type CommandResult<T> = ICommandSuccess<T> | ICommandError;

/**
 *  Prints output of a command if success if false then calls process.exit(1)
 */
export function assertCommandError(
  result: CommandResult<unknown>,
  ora?: Ora,
): asserts result is Extract<CommandResult<unknown>, { success: true }> {
  if (result.warnings && result.warnings.length) {
    console.log(chalk.yellow(`${result.warnings.join('\n')}\n`));
  }

  if (result.success === false) {
    if (ora) ora.fail('Failed');

    if (result.errors.length > 0) {
      console.log(chalk.red(`${result.errors.join('\n')}\n`));
    }

    process.exit(1);
  } else {
    if (ora) ora.succeed('Completed');
  }
}
