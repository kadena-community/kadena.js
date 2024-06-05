import type { ISendRequestBody, SendResponse } from './interfaces/PactAPI';
import { parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';
import { fetch } from './utils/fetch';
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
export async function send(
  requestBody: ISendRequestBody,
  apiHost: string,
): Promise<SendResponse> {
  const request = stringifyAndMakePOSTRequest(requestBody);
  const sendUrl = new URL(`${apiHost}/api/v1/send`);

  const response = await fetch(sendUrl.toString(), request);
  return parseResponse<SendResponse>(response);
}
