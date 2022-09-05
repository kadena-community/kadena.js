import type { ISPVRequestBody, SPVResponse } from '@kadena/types';

import { parseResponseTEXT } from './parseResponseTEXT';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import fetch, { Response } from 'cross-fetch';

/**
 * Blocking request to fetch spv proof of a cross chain transaction.
 * Request must be sent to the chain where the transaction is initiated.
 *
 * @param requestBody -
 * @param apiHost - API host running a Pact-enabled server.
 * @return -
 */
export function spv(
  requestBody: ISPVRequestBody,
  apiHost: string,
): Promise<SPVResponse | Response> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<SPVResponse | Response> = fetch(
    `${apiHost}/spv`,
    request,
  ).then((r) => parseResponseTEXT(r));

  return response;
}
