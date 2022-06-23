import { Command } from '../util/PactCommand';
import { Base64Url } from '../util/Base64Url';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { parseResponse } from './parseResponse';
import fetch, { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse } from 'node-fetch';

/**
 * Request type of /send endpoint.
 *
 * @param cmds - Non-empty array of Pact commands (or transactions) to submit to server.
 */
export type SendRequestBody = {
  cmds: Array<Command>
};

/**
 * Response type of /send endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) of the transactions submitted.
 *                      Can be sent to /poll and /listen to retrieve transaction results.
 */
export type SendResponse = {
  requestKeys: Array<Base64Url>
};

/**
 * Asynchronous submission of one or more public (unencrypted) commands to the blockchain for execution.
 *
 * @param requestBody - Non-empty list of Pact commands to submit to the server.
 * @param apiHost - API host running a Pact-enabled server.
 * @returns - Non-empty list of the submitted commands' request key.
 */
export function send(requestBody: SendRequestBody, apiHost: string):Promise<SendResponse> {
  let request:NodeFetchRequestInit = stringifyAndMakePOSTRequest<SendRequestBody>(requestBody);
  let response:Promise<NodeFetchResponse> = fetch(`${apiHost}/api/v1/send`, request);
  const parsedRes: Promise<SendResponse> = parseResponse(response);
  return parsedRes;
}
