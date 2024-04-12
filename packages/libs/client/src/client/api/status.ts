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
  } = options ?? {};
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
    const pollResponse = await poll({ requestKeys }, host, confirmationDepth);
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
