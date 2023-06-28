import {
  ICommandResult,
  IPollResponse,
  parseResponse,
} from '@kadena/chainweb-node-client';

import { retry } from '../utils/retry';
import {
  getPromise,
  getUrl,
  IExtPromise,
  IPollOptions,
  IPollRequestPromise,
  jsonRequest,
  mapRecord,
  mergeAll,
} from '../utils/utils';

import fetch from 'cross-fetch';

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

export interface IPollStatus {
  (
    host: string,
    requestIds: string[],
    options?: IPollOptions,
  ): IPollRequestPromise<ICommandResult>;
}

/**
 * poll until all request are fulfilled
 */
export const pollStatus: IPollStatus = (
  host: string,
  requestIds: string[],
  options?: IPollOptions,
): IPollRequestPromise<ICommandResult> => {
  const { onPoll = () => {}, timeout, interval } = options || {};
  let requestKeys = [...requestIds];
  const prs: Record<string, IExtPromise<ICommandResult>> = requestKeys.reduce(
    (acc, requestKey) => ({
      ...acc,
      [requestKey]: getPromise(),
    }),
    {},
  );
  const task = async (): Promise<void> => {
    requestKeys.forEach(onPoll);
    const pollResponse = await getStatus(host, requestKeys);
    Object.values(pollResponse).forEach((item) => {
      prs[item.reqKey].resolve(item);
      requestKeys = requestKeys.filter((key) => key !== item.reqKey);
    });
    if (requestKeys.length > 0) {
      return Promise.reject(new Error('NOT_COMPLETED'));
    }
  };
  const retryStatus = retry(task);

  retryStatus({ interval, timeout }).catch((err) => {
    Object.values(prs).forEach((pr) => {
      if (!pr.fulfilled) {
        pr.reject(err);
      }
    });
  });

  const returnPromise: IPollRequestPromise<ICommandResult> = Object.assign(
    Promise.all(
      Object.entries(prs).map(([requestKey, pr]) =>
        pr.promise.then((data) => ({ [requestKey]: data })),
      ),
    ).then(mergeAll),
    { requests: mapRecord(prs, ({ promise }) => promise) },
  );

  return returnPromise;
};
