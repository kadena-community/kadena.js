import type { ICommand, IUnsignedCommand } from '@kadena/types';

/**
 * Determines if a command is signed.
 * @alpha
 * @param command -  command The command to check.
 * @returns True if the command is signed, false otherwise.
 */
export function isSignedCommand(
  command: IUnsignedCommand | ICommand,
): command is ICommand {
  return command.sigs.every((s) => s?.sig !== undefined);
}

/**
 * @alpha
 */
export function ensureSignedCommand(
  command: IUnsignedCommand | ICommand,
): ICommand {
  if (isSignedCommand(command)) {
    return command;
  } else {
    throw new Error('Command must be signed');
  }
}
