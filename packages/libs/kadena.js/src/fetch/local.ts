import type {
  RequestInit as NodeFetchRequestInit,
  Response as NodeFetchResponse,
} from 'node-fetch';
import fetch from 'node-fetch';

import type { LocalRequestBody, LocalResponse } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

/**
 * Blocking/sync call to submit a command for non-transactional execution.
 * In a blockchain environment this would be a node-local “dirty read”.
 * Any database writes or changes to the environment are rolled back.
 *
 * @param requestBody - Pact command to submit to server (non-transactional).
 * @param apiHost - API host running a Pact-enabled server.
 * @return - The command result returned by the server.
 */
export function local(
  requestBody: LocalRequestBody,
  apiHost: string,
): Promise<LocalResponse> {
  const request: NodeFetchRequestInit =
    stringifyAndMakePOSTRequest<LocalRequestBody>(requestBody);
  const response: Promise<NodeFetchResponse> = fetch(
    `${apiHost}/api/v1/local`,
    request,
  );
  const parsedRes: Promise<LocalResponse> = parseResponse(response);
  return parsedRes;
}
