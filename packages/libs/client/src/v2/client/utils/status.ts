import { IPollResponse, parseResponse } from '@kadena/chainweb-node-client';

import { getUrl, IPollOptions, jsonRequest } from './request';
import { retry } from './retry';

export const getStatus = async (
  host: string,
  requestKeys: string[],
): Promise<IPollResponse> => {
  const request = jsonRequest({ requestKeys });
  const url = getUrl(host, `api/v1/poll`);

  try {
    const response = await fetch(url, request);
    return await parseResponse(response);
  } catch (error) {
    console.error(`An error occurred while calling poll API:`, error);
    throw error;
  }
};

export type PollFunction = (
  host: string,
  requestIds: string[],
  options?: IPollOptions,
) => Promise<IPollResponse>;

/**
 * poll until all request are fulfilled
 */
export const pollStatus: PollFunction = (host, requestIds, options) => {
  const task = async (): Promise<IPollResponse> => {
    const res = await getStatus(host, requestIds);
    if (Object.keys(res).length < requestIds.length) {
      throw new Error('NPT_COMPLETED');
    }
    return res;
  };
  const retryPoll = retry(task);

  return retryPoll(options);
};
