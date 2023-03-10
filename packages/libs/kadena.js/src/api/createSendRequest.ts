import { isSignedCommand } from '@kadena/cryptography-utils';
import type {
  ICommand,
  ISendRequestBody,
  IUnsignedCommand,
} from '@kadena/types';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export function createSendRequest(
  commands: Array<IUnsignedCommand>,
): ISendRequestBody {
  return {
    cmds: commands.filter(throwErrorIfUnsigned),
  };
}

function throwErrorIfUnsigned(
  command: IUnsignedCommand | ICommand,
): command is ICommand {
  if (!isSignedCommand(command)) throw new Error('Command is not fully signed');
  return isSignedCommand(command);
}
