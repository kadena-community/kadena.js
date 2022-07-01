import type { PollRequestBody, SendRequestBody } from '@kadena/types';

import { unique } from '../util/unique';
/**
 * Given an exec 'send' message, prepare a message for 'poll' endpoint.
 * @param execMsg {object} JSON with "cmds" field, see 'mkPublicSend'
 * @return {object} with "requestKeys" for polling.
 */

export function createPollRequest({ cmds }: SendRequestBody): PollRequestBody {
  return { requestKeys: unique(cmds.map(({ hash }) => hash)) };
}
