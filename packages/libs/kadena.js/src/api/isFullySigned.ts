import type { ICommand, IUnsignedCommand } from '@kadena/types';
/**
 * @alpha
 */
export function isFullySigned(command: IUnsignedCommand): ICommand {
  if (command.sigs.filter((sig) => !!sig).length > 0) {
    throw new Error('command is not fully signed');
  } else return command;
}
