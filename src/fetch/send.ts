import { Command } from '../util/PactCommand';
import { Base16String } from '../util/Base16String';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { parseRes } from './parseRes';

/**
 * Request type of /send endpoint.
 * Non-empty array of Pact commands (or transactions) to submit to server.
 */
export type SendRequestBody = {
  cmds: Array<Command>
};

/**
 * Response type of /send endpoint, which returns a list of the request
 * keys (or transaction hashes) of the transactions submitted.
 *
 * The list can be sent to /poll and /listen to retrieve the results
 * of the transactions.
 */
export type SendResponse = {
  requestKeys: Array<Base16String>
};

/**
 * Asynchronous submission of one or more public (unencrypted) commands to the blockchain for execution.
 *
 * Corresponds to `fetchSendRaw` and `fetchSend` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L601
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L589
 *
 * @param reqBody - Non-empty array of Pact commands to submit to server.
 * @param apiHost - API host running a Pact-enabled server.
 * @returns - Raw Response from Server.
 */
export function send(reqBody: SendRequestBody, apiHost: string):Promise<SendResponse> {
  let req = stringifyAndMakePOSTRequest<SendRequestBody>(reqBody);
  let res = fetch(`${apiHost}/api/v1/send`, req);
  const parsedRes: Promise<SendResponse> = parseRes(res);
  return parsedRes;
}
