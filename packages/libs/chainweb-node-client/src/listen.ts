import type { ICommandResult, IListenRequestBody } from './interfaces/PactAPI';
import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { fetch } from './utils/fetch';

/**
 * Blocking request for single command result.
 *
 * @param requestBody - The request key of transaction submitted to the server that we want to know the results of.
 * @param apiHost - API host running a Pact-enabled server.
 * @alpha
 */
export async function listen(
  requestBody: IListenRequestBody,
  apiHost: string,
  { headers }: { headers?: Record<string, string> } = {},
): Promise<ICommandResult> {
  const request = stringifyAndMakePOSTRequest(requestBody, headers);
  const listenUrl = new URL(`${apiHost}/api/v1/listen`);

  const response = await fetch(listenUrl.toString(), request);
  return parseResponse<ICommandResult>(response);
}
