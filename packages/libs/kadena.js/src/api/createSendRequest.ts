import type { Command, SendRequest } from '@kadena/types';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export function createSendRequest(commands: Array<Command>): SendRequest {
  return { cmds: commands };
}
