import { unique, SendRequest, ListenRequest } from '../util';
/**
 * Given an exec 'send' message, prepare a message for 'listen' endpoint.
 * @param execMsg {object} JSON with "cmds" field, see 'mkPublicSend'. Only takes first element.
 * @return {object} with "requestKey" for polling.
 */
export default function createListenRequest({
  cmds,
}: SendRequest): ListenRequest {
  return { listen: unique(cmds.map(({ hash }) => hash))[0] };
}
