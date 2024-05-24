import { fetch } from 'node-fetch-native';
import type { IPollRequestBody, IPollResponse } from './interfaces/PactAPI';
import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
/**
 * Allows polling for one or more transaction results by request key.
 * Returns an Array of the transaction results we polled for.
 * If a transaction is missing, then it might still be in the mempool, or might have expired.
 *
 * @param requestBody - The request keys of transactions submitted to the server
 *                      that we want to know the results of.
 *                      Must be non-empty list.
 * @param apiHost - API host running a Pact-enabled server.
 *
 * @alpha
 */
export async function poll(
  requestBody: IPollRequestBody,
  apiHost: string,
  confirmationDepth = 0,
): Promise<IPollResponse> {
  const request = stringifyAndMakePOSTRequest(requestBody);
  const pollUrl = new URL(`${apiHost}/api/v1/poll`);
  if (confirmationDepth > 0) {
    pollUrl.searchParams.append(
      'confirmationDepth',
      confirmationDepth.toString(),
    );
  }
  const response = await fetch(pollUrl.toString(), request);
  return parseResponse<IPollResponse>(response);
}
