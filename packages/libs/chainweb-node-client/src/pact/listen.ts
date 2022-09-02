import type { ICommandResult, IListenRequestBody } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import fetch from 'cross-fetch';

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
): Promise<ICommandResult | Response> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<ICommandResult | Response> = fetch(
    `${apiHost}/api/v1/listen`,
    request,
  ).then((r) => parseResponse<ICommandResult>(r));

  return response;
}
