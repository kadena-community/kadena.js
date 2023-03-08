import { isSigned } from '@kadena/cryptography-utils';
import type { ISendRequestBody, IUnsignedCommand } from '@kadena/types';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export function createSendRequest(
  commands: Array<IUnsignedCommand>,
): ISendRequestBody {
  return { cmds: commands.filter(isSigned) };
}
