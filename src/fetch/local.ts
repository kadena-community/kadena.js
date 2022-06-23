import { Command, CommandResult } from '../util/PactCommand';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { parseResponse } from './parseResponse';
import fetch, { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse } from 'node-fetch';

export type LocalRequestBody = Command;
export type LocalResponse = CommandResult;

/**
 * Blocking/sync call to submit a command for non-transactional execution.
 * In a blockchain environment this would be a node-local “dirty read”.
 * Any database writes or changes to the environment are rolled back.
 *
 * @param requestBody - Pact command to submit to server (non-transactional).
 * @param apiHost - API host running a Pact-enabled server.
 * @returns - The command result returned by the server.
 */
 export function local(requestBody: LocalRequestBody, apiHost: string):Promise<LocalResponse> {
  let request:NodeFetchRequestInit = stringifyAndMakePOSTRequest<LocalRequestBody>(requestBody);
  let response:Promise<NodeFetchResponse> = fetch(`${apiHost}/api/v1/local`, request);
  const parsedRes: Promise<LocalResponse> = parseResponse(response);
  return parsedRes;
}
