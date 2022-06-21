import { unique, PublicRequest } from '../util';
/**
 * Given an exec 'send' message, prepare a message for 'listen' endpoint.
 * @param execMsg {object} JSON with "cmds" field, see 'mkPublicSend'. Only takes first element.
 * @return {object} with "requestKey" for polling.
 */
export default function createListenRequest(execMsg: PublicRequest): object {
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
        JSON.stringify(execMsg),
    );
  } else {
    rks = unique(
      cmds.map(function (v) {
        return v.hash;
      }),
    );
  }
  return { listen: rks[0] };
}
