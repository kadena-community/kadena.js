import { parseResponse } from '@kadena/chainweb-node-client';

import { getUrl, IPollOptions, jsonRequest } from './request';
import { retry } from './retry';

export async function getSpv(
  host: string,
  requestKey: string,
  targetChainId: string,
): Promise<string> {
  const request = jsonRequest({ requestKey, targetChainId });
  const url = getUrl(host, 'spv');

  try {
    const response = await fetch(url, request);
    return await parseResponse(response);
  } catch (error) {
    console.error(`An error occurred while calling spv API:`, error);
    throw error;
  }
}

export const pollSpv = (
  host: string,
  requestKey: string,
  targetChainId: string,
  pollingOptions?: IPollOptions,
): Promise<string> => {
  const task = async (): Promise<string> =>
    getSpv(host, requestKey, targetChainId);

  const retrySpv = retry(task);

  return retrySpv(pollingOptions);
};
