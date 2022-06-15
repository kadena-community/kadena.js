import { asArray, PreparedCommand } from '../util';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export function mkPublicSend(cmds: Array<PreparedCommand>): object {
  return { cmds: cmds };
}
