import { Command, SendRequest } from '../util';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export default function createSendRequest(
  commands: Array<Command>,
): SendRequest {
  return { cmds: commands };
}
