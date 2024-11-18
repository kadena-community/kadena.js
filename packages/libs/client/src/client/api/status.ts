import type { ICommandResult } from '@kadena/chainweb-node-client';
import { poll } from '@kadena/chainweb-node-client';
import type {
  IPollOptions,
  IPollRequestPromise,
} from '../interfaces/interfaces';
import { retry } from '../utils/retry';
import type { IExtPromise } from '../utils/utils';
import { getPromise, mapRecord, mergeAll } from '../utils/utils';

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
  const {
    onPoll = () => {},
    timeout,
    interval,
    confirmationDepth = 0,
    onResult = () => {},
    ...requestInit
  } = options ?? {};
  const signal = requestInit.signal ?? undefined;
  let requestKeys = [...requestIds];
  const prs: Record<string, IExtPromise<ICommandResult>> = requestKeys.reduce(
    (acc, requestKey) => ({
      ...acc,
      [requestKey]: getPromise(),
    }),
    {},
  );
  const task = async (): Promise<void> => {
    try {
      requestKeys.forEach(onPoll);
      const pollResponse = await poll(
        { requestKeys },
        host,
        confirmationDepth,
        requestInit,
      );
      Object.values(pollResponse).forEach((item) => {
        prs[item.reqKey].resolve(item);
        onResult(item.reqKey, item);
        requestKeys = requestKeys.filter((key) => key !== item.reqKey);
      });
    } catch (error) {
      onPoll(undefined, error);
      throw error;
    }
    if (requestKeys.length > 0) {
      return Promise.reject(new Error('NOT_COMPLETED'));
    }
  };
  const retryStatus = retry(task, signal);

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
