import type { IPollRequestBody, IPollResponse } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import fetch from 'cross-fetch';

/**
 * Allows polling for one or more transaction results by request key.
 *
 * @param requestBody - The request keys of transactions submitted to the server
 *                      that we want to know the results of.
 *                      Must be non-empty list.
 * @param apiHost - API host running a Pact-enabled server.
 * @return - Array of the transaction results we polled for.
 *            If a transaction is missing, then it might still be in the mempool,
 *            or might have expired.
 */
export function poll(
  requestBody: IPollRequestBody,
  apiHost: string,
): Promise<IPollResponse | Response> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<IPollResponse | Response> = fetch(
    `${apiHost}/api/v1/poll`,
    request,
  ).then((r) => parseResponse<IPollResponse>(r));

  return response;
}
