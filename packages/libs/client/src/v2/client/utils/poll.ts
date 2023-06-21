import { IPollResponse } from '@kadena/chainweb-node-client';

import { request } from './request';
import { retry } from './retry';

export const poll = (
  host: string,
  requestKeys: string[],
): Promise<IPollResponse> =>
  request<{ requestKeys: string[] }, IPollResponse>('poll')(host, {
    requestKeys,
  });

export interface IPollUntilOptions {
  onPoll?: (counter: number) => void;
  timeout?: number;
  interval?: number;
}

export type PollFunction = (
  host: string,
  requestIds: string[],
  options?: IPollUntilOptions,
) => Promise<IPollResponse>;

/**
 * poll until all request are fulfilled
 */
export const pollUntil: PollFunction = (host, requestIds, options) => {
  const {
    onPoll = () => {},
    timeout = 1000 * 60 * 3,
    interval = 5000,
  } = options ?? {};

  const task = async (): Promise<IPollResponse> => {
    const res = await poll(host, requestIds);
    if (Object.keys(res).length < requestIds.length) {
      throw new Error('NPT_COMPLETED');
    }
    return res;
  };
  const retryPoll = retry(task, onPoll);

  return retryPoll(timeout, interval);
};
