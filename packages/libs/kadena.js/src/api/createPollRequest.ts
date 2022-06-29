import { PollRequest, SendRequest, unique } from '../util';
/**
 * Given an exec 'send' message, prepare a message for 'poll' endpoint.
 * @param execMsg {object} JSON with "cmds" field, see 'mkPublicSend'
 * @return {object} with "requestKeys" for polling.
 */
export default function createPollRequest({ cmds }: SendRequest): PollRequest {
  return { requestKeys: unique(cmds.map(({ hash }) => hash)) };
}
