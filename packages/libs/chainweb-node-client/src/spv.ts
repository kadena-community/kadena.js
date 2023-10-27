import fetch from 'cross-fetch';
import type { ISPVRequestBody, SPVResponse } from './interfaces/PactAPI';
import { parseResponseTEXT } from './parseResponseTEXT';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

/**
 * Blocking request to fetch spv proof of a cross chain transaction.
 * Request must be sent to the chain where the transaction is initiated.
 *
 * @param requestBody -
 * @param apiHost - API host running a Pact-enabled server.
 * @alpha
 */
export async function spv(
  requestBody: ISPVRequestBody,
  apiHost: string,
): Promise<SPVResponse | Response> {
  const request = stringifyAndMakePOSTRequest(requestBody);
  const spvUrl = new URL(`${apiHost}/spv`);
  try {
    const response = await fetch(spvUrl.toString(), request);
    return await parseResponseTEXT(response);
  } catch (error) {
    console.error('An error occurred while calling spv API:', error);
    throw error;
  }
}
