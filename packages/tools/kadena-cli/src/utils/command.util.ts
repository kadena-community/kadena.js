import chalk from 'chalk';

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
): asserts result is Extract<CommandResult<unknown>, { success: true }> {
  if (result.success === false) {
    if (result.warnings && result.warnings.length) {
      console.log(chalk.yellow(`${result.warnings.join('\n')}\n`));
    }
    if (result.errors.length) {
      console.log(chalk.red(`${result.errors.join('\n')}\n`));
    }
    process.exit(1);
  }
}
