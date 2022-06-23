import type { Base16String } from '../util/Base16String';
import type { Command } from '../util/PactCommand';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import type {
  RequestInit as NodeFetchRequestInit,
  Response as NodeFetchResponse,
} from 'node-fetch';
import fetch from 'node-fetch';

/**
 * Request type of /send endpoint.
 *
 * @param cmds - Non-empty array of Pact commands (or transactions) to submit to server.
 */
export type SendRequestBody = {
  cmds: Array<Command>;
};

/**
 * Response type of /send endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) of the transactions submitted.
 *                      Can be sent to /poll and /listen to retrieve transaction results.
 */
export type SendResponse = {
  requestKeys: Array<Base16String>;
};

/**
 * Asynchronous submission of one or more public (unencrypted) commands to the blockchain for execution.
 *
 * Corresponds to `fetchSendRaw` and `fetchSend` functions:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L601
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L589
 *
 * @param requestBody - Non-empty array of Pact commands to submit to server.
 * @param apiHost - API host running a Pact-enabled server.
 * @return - Raw Response from Server.
 */
export function send(
  requestBody: SendRequestBody,
  apiHost: string,
): Promise<SendResponse> {
  const request: NodeFetchRequestInit =
    stringifyAndMakePOSTRequest<SendRequestBody>(requestBody);
  const response: Promise<NodeFetchResponse> = fetch(
    `${apiHost}/api/v1/send`,
    request,
  );
  const parsedRes: Promise<SendResponse> = parseResponse(response);
  return parsedRes;
}
