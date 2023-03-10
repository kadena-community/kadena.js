import type { ICommand, IUnsignedCommand } from '@kadena/types';

/**
 * @alpha
 */
export function isSignedCommand(
  command: IUnsignedCommand | ICommand,
): command is ICommand {
  return (
    command.sigs.filter((s) => {
      return !(s && s.sig);
    }).length === 0
  );
}
