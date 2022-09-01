import type { ISPVRequestBody, SPVResponse } from '@kadena/types';

import { parseResponseTEXT } from './parseResponseTEXT';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import type {
  RequestInit as NodeFetchRequestInit,
  Response as NodeFetchResponse,
} from 'isomorphic-fetch';
import fetch from 'isomorphic-fetch';

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
): Promise<SPVResponse> {
  const request: NodeFetchRequestInit =
    stringifyAndMakePOSTRequest<ISPVRequestBody>(requestBody);
  const response: Promise<NodeFetchResponse> = fetch(`${apiHost}/spv`, request);
  const parsedRes: Promise<SPVResponse> = parseResponseTEXT(response);
  return parsedRes;
}
