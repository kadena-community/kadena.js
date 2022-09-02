import type { ICommandResult, IListenRequestBody } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import 'isomorphic-fetch';

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
  requestBody: IListenRequestBody,
  apiHost: string,
): Promise<ICommandResult | Response> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<ICommandResult | Response> = fetch(
    `${apiHost}/api/v1/local`,
    request,
  ).then((r) => parseResponse<ICommandResult>(r));

  return response;
}
