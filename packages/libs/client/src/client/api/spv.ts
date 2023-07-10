import { IPollOptions } from '../interfaces/interfaces';
import { retry } from '../utils/retry';
import { getUrl, jsonRequest } from '../utils/utils';

import fetch from 'cross-fetch';

export async function getSpv(
  host: string,
  requestKey: string,
  targetChainId: string,
): Promise<string> {
  const request = jsonRequest({ requestKey, targetChainId });
  const url = getUrl(host, 'spv');

  try {
    const response = await fetch(url, request);
    if (response.ok) {
      return await response.text();
    }
    throw await response.text();
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
