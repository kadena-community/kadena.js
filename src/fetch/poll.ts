import { CommandResult } from '../util/PactCommand';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { parseResponse } from './parseResponse';
import fetch, { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse } from 'node-fetch';
import { Base64Url } from '../util/Base64Url';


/**
 * Request type of /poll endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) to poll for.
 */
export type PollRequestBody = {
  requestKeys: Array<Base64Url>
};

export type PollResponse = Array<CommandResult>;

/**
 * Allows polling for one or more transaction results by request key.
 *
 * @param requestBody - The request keys of transactions submitted to the server
 *                      that we want to know the results of.
 *                      Must be non-empty list.
 * @param apiHost - API host running a Pact-enabled server.
 * @returns - Array of the transaction results we polled for.
 *            If a transaction is missing, then it might still be in the mempool,
 *            or might have expired.
 */
 export function poll(requestBody: PollRequestBody, apiHost: string):Promise<PollResponse> {
  let request:NodeFetchRequestInit = stringifyAndMakePOSTRequest<PollRequestBody>(requestBody);
  let response:Promise<NodeFetchResponse> = fetch(`${apiHost}/api/v1/poll`, request);
  const parsedRes: Promise<PollResponse> = parseResponse(response);
  return parsedRes;
}
