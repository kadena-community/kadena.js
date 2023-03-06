import type { ICommand, IPartiallySigned } from '@kadena/types';
/**
 * @alpha
 */
export function isFullySigned(command: IPartiallySigned): ICommand {
  if (command.sigs.filter((sig) => !!sig).length > 0) {
    throw new Error('command is not fully signed');
  } else return command;
}
