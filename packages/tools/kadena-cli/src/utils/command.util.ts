import type { Ora } from 'ora';
import { log } from './logger.js';

export class CommandError extends Error {
  public warnings: string[];
  public errors: string[];
  public exitCode: number = 0;
  public args?: Record<string, unknown>;

  public constructor({
    errors,
    warnings,
    exitCode,
    args,
  }: {
    errors?: string[];
    warnings?: string[];
    exitCode?: number;
    args?: Record<string, unknown>;
  }) {
    super(`Error:\n${(warnings ?? []).join('\n')}${(errors ?? []).join('\n')}`);
    this.errors = errors ?? [];
    this.warnings = warnings ?? [];
    this.exitCode = exitCode ?? 0;
    this.args = args;
  }
}

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
    log.warning(`${result.warnings.join('\n')}\n`);
  }

  if (result.success === false) {
    if (ora) ora.fail('Failed');

    if (result.errors.length > 0) {
      log.error(`${result.errors.join('\n')}\n`);
    }

    throw new CommandError({
      errors: result.errors,
      warnings: result.warnings,
      exitCode: 1,
    });
  } else {
    if (ora) ora.succeed('Completed');
  }
}
