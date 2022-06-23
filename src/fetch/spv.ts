import { ChainwebChainId, SPVProof } from '../util/PactCommand';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { parseResponse } from './parseResponse';
import fetch, { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse } from 'node-fetch';
import { Base64Url } from '../util/Base64Url';

/**
 * Request type of /spv endpoint.
 *
 * @param requestKey - Request Key of an initiated cross chain transaction at the source chain.
 * @param targetChainId - Target chain id of the cross chain transaction.
 */
export type SPVRequestBody = {
  requestKey: Base64Url;
  targetChainId: ChainwebChainId;
};

/**
 * Response type of /spv endpoint.
 *
 * Returns backend-specific data for continuing a cross-chain proof.
 *
 */
export type SPVResponse = SPVProof;

/**
 * Blocking request to fetch spv proof of a cross chain transaction.
 * Request must be sent to the chain where the transaction is initiated.
 *
 * @param requestBody -
 * @param apiHost - API host running a Pact-enabled server.
 * @returns -
 */
export function spv(requestBody: SPVRequestBody, apiHost: string):Promise<SPVResponse> {
  let request:NodeFetchRequestInit = stringifyAndMakePOSTRequest<SPVRequestBody>(requestBody);
  let response:Promise<NodeFetchResponse> = fetch(`${apiHost}/api/v1/local`, request);
  const parsedRes: Promise<SPVResponse> = parseResponse(response);
  return parsedRes;
}
