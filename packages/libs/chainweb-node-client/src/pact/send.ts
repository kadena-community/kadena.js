import type { Base16String, ICommand } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import type { Response } from 'cross-fetch';
import fetch from 'cross-fetch';

/**
 * Request type of /send endpoint.
 *
 * @param cmds - Non-empty array of Pact commands (or transactions) to submit to server.
 * @alpha
 */
export interface IISendRequestBody {
  cmds: Array<ICommand>;
}

/**
 * Response type of /send endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) of the transactions submitted.
 *                      Can be sent to /poll and /listen to retrieve transaction results.
 * @alpha
 */
export interface ISendResponse {
  requestKeys: Array<Base16String>;
}

/**
 * Asynchronous submission of one or more public (unencrypted) commands to the blockchain for execution.
 *
 * Corresponds to `fetchSendRaw` and `fetchSend` functions:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L601
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L589
 *
 * @param requestBody - Non-empty array of Pact commands to submit to server.
 * @param apiHost - API host running a Pact-enabled server.
 * @alpha
 */
export function send(
  requestBody: IISendRequestBody,
  apiHost: string,
): Promise<ISendResponse | Response> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<ISendResponse | Response> = fetch(
    `${apiHost}/api/v1/send`,
    request,
  ).then((r) => parseResponse(r));

  return response;
}
