import { Command, PublicRequest } from '../util';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export default function mkPublicSend(commands: Array<Command>): PublicRequest {
  return { cmds: commands };
}
