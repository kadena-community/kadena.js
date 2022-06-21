import { PublicRequest, RequestKeys, Command, unique } from '../util';
/**
 * Given an exec 'send' message, prepare a message for 'poll' endpoint.
 * @param execMsg {object} JSON with "cmds" field, see 'mkPublicSend'
 * @return {object} with "requestKeys" for polling.
 */
export default function createPollRequest(execMsg: PublicRequest): RequestKeys {
  const cmds =
    execMsg.cmds ||
    TypeError("expected key 'cmds' in object: " + JSON.stringify(execMsg));
  let rks = [];
  if (
    !cmds.every(function (v) {
      return v.hasOwnProperty('hash');
    })
  ) {
    throw new TypeError(
      'maleformed object, expected "hash" key in every cmd: ' +
        JSON.stringify({ cmds }),
    );
  } else {
    rks = unique(
      cmds.map(function (v) {
        return v.hash;
      }),
    );
  }
  return { requestKeys: rks };
}
