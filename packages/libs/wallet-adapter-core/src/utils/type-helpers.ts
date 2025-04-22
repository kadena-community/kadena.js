import type { IJsonRpcSuccess, JsonRpcResponse } from '../types';

/**
 * @public
 */
export const isJsonRpcSuccess = <T>(
  response: JsonRpcResponse<T>,
): response is IJsonRpcSuccess<T> => {
  return !!(response as IJsonRpcSuccess<T>)?.result;
};

/**
 * @public
 */
export const isJsonRpcResponse = (response: any): boolean => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'jsonrpc' in response &&
    response.jsonrpc === '2.0' &&
    'id' in response &&
    (('result' in response && !('error' in response)) ||
      ('error' in response && !('result' in response)))
  );
};
