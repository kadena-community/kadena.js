import { asArray, preparedCommand } from '../util';
/**
 * Makes outer wrapper for a 'send' endpoint.
 * @param {array or object} cmds - one or an array of commands, see mkSingleCmd
 */
export function mkPublicSend(
  cmds: Array<preparedCommand> | preparedCommand,
): object {
  return { cmds: asArray(cmds) };
}
