
type Host = string;

type RequestBody = SendRequestBody;

type ChainwebChainId = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19';
export type ChainwebMetaData = {
  creationTime: number, // TODO: What's the haskell type of this
  ttl: number,
  gasLimit: number,
  gasPrice: number,
  sender: string,
  chainId: ChainwebChainId
};

// TODO: mkMeta: https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L513

type SendRequestBodyPayload = string;

type SendRequestBody = {
  cmds: Array<SendRequestBodyPayload>
};
/** Corresponds to `mkPublicSend`:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L359
 *
 * Original comment: Outer wrapper for a 'send' endpoint
 *
 * @param arr
 * @returns
 */
function payloadArrayToSendReqBody(arr: Array<SendRequestBodyPayload>): SendRequestBody {
  return {
    cmds: arr,
  };
}

/** Corresponds to `mkReq` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L533
 *
 * Original comment: Formats api request object
 *
 * @param cmd
 * @returns
 */
function stringifyAndMakePOSTRequest(cmd: RequestBody): RequestInit {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(cmd),
  };
}


/** Corresponds to `fetchSendRaw` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L601
 *
 * @param sendRequest
 * @param apiHost
 * @returns
 */
export function rawSend(sendRequest: Array<SendRequestBodyPayload>, apiHost: Host): Promise<Response> {
  return fetch(`${apiHost}/api/v1/send`, stringifyAndMakePOSTRequest(payloadArrayToSendReqBody(sendRequest)));
}
