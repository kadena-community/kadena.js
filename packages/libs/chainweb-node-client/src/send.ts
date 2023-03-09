import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { ISendRequestBody, SendResponse } from '@kadena/types';

import fetch from 'cross-fetch';

/**
 * Asynchronous submission of one or more public (unencrypted) commands to the blockchain for execution.
 *
 * Corresponds to `fetchSendRaw` and `fetchSend` functions:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L601
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L589
 *
 * @param requestBody - Non-empty array of Pact commands to submit to server.
 * @param apiHost - API host running a Pact-enabled server.
 * @alpha
 */
export function send(
  requestBody: ISendRequestBody,
  apiHost: string,
): Promise<SendResponse> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<SendResponse> = fetch(
    `${apiHost}/api/v1/send`,
    request,
  ).then((r) => parseResponse(r));

  return response;
}
