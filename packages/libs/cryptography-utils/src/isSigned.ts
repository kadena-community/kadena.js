import type { ICommand, IUnsignedCommand } from '@kadena/types';

/**
 * @alpha
 */
export function isSigned(
  command: IUnsignedCommand | ICommand,
): command is ICommand {
  return (
    command.sigs.filter(({ sig }) => {
      return !!sig ?? false;
    }).length === 0
  );
}
