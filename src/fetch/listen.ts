import { CommandResult } from '../util/PactCommand';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { parseResponse } from './parseResponse';
import fetch, { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse } from 'node-fetch';
import { Base64Url } from '../util/Base64Url';

/**
 * Request type of /listen endpoint.
 *
 * @param listen - Single request key (or command hash) to listen for.
 */
 export type ListenRequestBody = {
  listen: Base64Url
};

export type ListenResponse = CommandResult;

/**
 * Blocking request for single command result.
 *
 * @param requestBody - The request key of transaction submitted to the server that we want to know the results of.
 * @param apiHost - API host running a Pact-enabled server.
 * @returns - The transaction result we listened for.
 */
 export function listen(requestBody: ListenRequestBody, apiHost: string):Promise<ListenResponse> {
  let request:NodeFetchRequestInit = stringifyAndMakePOSTRequest<ListenRequestBody>(requestBody);
  let response:Promise<NodeFetchResponse> = fetch(`${apiHost}/api/v1/poll`, request);
  const parsedRes: Promise<ListenResponse> = parseResponse(response);
  return parsedRes;
}
