import type { ICommand, IUnsignedCommand } from '@kadena/types';

/**
 * Determines if a command is fully signed.
 *
 * @param command - The command to check.
 * @returns True if the command is signed, false otherwise.

 * @public
 */
export function isSignedTransaction(
  command: IUnsignedCommand | ICommand,
): command is ICommand {
  return command.sigs.every((s) => s?.sig !== undefined);
}
