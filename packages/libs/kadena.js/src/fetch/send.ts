import type { SendRequestBody, SendResponse } from '@kadena/types';

import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import type {
  RequestInit as NodeFetchRequestInit,
  Response as NodeFetchResponse,
} from 'node-fetch';
import fetch from 'node-fetch';

/**
 * Asynchronous submission of one or more public (unencrypted) commands to the blockchain for execution.
 *
 * Corresponds to `fetchSendRaw` and `fetchSend` functions:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L601
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L589
 *
 * @param requestBody - Non-empty array of Pact commands to submit to server.
 * @param apiHost - API host running a Pact-enabled server.
 * @return - Raw Response from Server.
 */
export function send(
  requestBody: SendRequestBody,
  apiHost: string,
): Promise<SendResponse> {
  const request: NodeFetchRequestInit =
    stringifyAndMakePOSTRequest<SendRequestBody>(requestBody);
  const response: Promise<NodeFetchResponse> = fetch(
    `${apiHost}/api/v1/send`,
    request,
  );
  const parsedRes: Promise<SendResponse> = parseResponse(response);
  return parsedRes;
}
