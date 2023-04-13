import { unique } from '@kadena/cryptography-utils';
import type { IPollRequestBody, ISendRequestBody } from './interfaces/PactAPI';

/**
 * Given an exec 'send' message, prepare a message for 'poll' endpoint.
 * @alpha
 * @param request - JSON with "cmds" field, see 'mkPublicSend'
 * @returns Object with "requestKeys" for polling.
 */
export function createPollRequest({
  cmds,
}: ISendRequestBody): IPollRequestBody {
  return { requestKeys: unique(cmds.map(({ hash }) => hash)) };
}
