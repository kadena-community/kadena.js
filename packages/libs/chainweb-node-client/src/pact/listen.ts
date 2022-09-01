import type { IListenRequestBody, ListenResponse } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import type {
  RequestInit as NodeFetchRequestInit,
  Response as NodeFetchResponse,
} from 'node-fetch';
import fetch from 'node-fetch';

/**
 * Blocking request for single command result.
 *
 * @param requestBody - The request key of transaction submitted to the server that we want to know the results of.
 * @param apiHost - API host running a Pact-enabled server.
 * @return - The transaction result we listened for.
 */
export function listen(
  requestBody: IListenRequestBody,
  apiHost: string,
): Promise<ListenResponse> {
  const request: NodeFetchRequestInit =
    stringifyAndMakePOSTRequest<IListenRequestBody>(requestBody);
  const response: Promise<NodeFetchResponse> = fetch(
    `${apiHost}/api/v1/listen`,
    request,
  );
  const parsedRes: Promise<ListenResponse> = parseResponse(response);
  return parsedRes;
}
