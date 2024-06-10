import type { ICommandResult } from '@kadena/client';
import fetch from 'cross-fetch';

export async function fetchModule(
  apiHost: string,
  body: string,
): Promise<
  | {
      error: string;
      code?: undefined;
    }
  | {
      error?: undefined;
      code: string;
    }
> {
  const response = await fetch(`${apiHost}/api/v1/local`, {
    headers: {
      accept: 'application/json;charset=utf-8, application/json',
      'cache-control': 'no-cache',
      'content-type': 'application/json;charset=utf-8',
      pragma: 'no-cache',
    },
    body,
    method: 'POST',
  });

  try {
    const responseJson = (await response.clone().json()) as ICommandResult;
    if (responseJson.result.status === 'success') {
      return { code: (responseJson.result.data as any).code };
    }
    const { error } = responseJson.result;
    if (error === undefined || typeof error === 'string') {
      return {
        error: error || 'unknown error',
      };
    }
    return {
      error:
        'message' in error
          ? (error.message as string)
          : JSON.stringify(responseJson.result.error),
    };
  } catch (e) {
    const responseText = await response.text();
    const errorMessage =
      typeof e === 'object' && e !== null && 'message' in e
        ? (e as Error).message
        : String(e);

    return {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      error: responseText ? responseText : errorMessage,
    };
  }
}
