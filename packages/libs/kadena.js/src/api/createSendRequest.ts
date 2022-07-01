import type { Command, SendRequestBody } from '@kadena/types';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export function createSendRequest(commands: Array<Command>): SendRequestBody {
  return { cmds: commands };
}
