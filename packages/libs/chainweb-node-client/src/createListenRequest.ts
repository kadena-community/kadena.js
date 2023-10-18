import { unique } from '@kadena/cryptography-utils';
import type {
  IListenRequestBody,
  ISendRequestBody,
} from './interfaces/PactAPI';

/**
 * Given an exec 'send' message, prepare a message for 'listen' endpoint.
 * @alpha
 * @param request - The JSON request object with "cmds" field, see 'mkPublicSend'. Only takes first element.
 * @returns Object with "requestKey" for polling.
 */
export function createListenRequest({
  cmds,
}: ISendRequestBody): IListenRequestBody {
  return { listen: unique(cmds.map(({ hash }) => hash))[0] };
}
