import type { ChainId } from '@kadena/types';
import type { IPollRequestPromise } from '../interfaces/interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const jsonRequest = (body: object) => ({
  headers: {
    'Content-Type': 'application/json' as const,
  },
  method: 'POST' as const,
  body: JSON.stringify(body),
});

export function getUrl(
  host: string,
  endpoint: string,
  params?: object,
): string {
  const cleanHost = host.endsWith('/') ? host.slice(0, host.length - 1) : host;
  const urlStr = `${cleanHost}${
    endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  }`;
  const url = new URL(urlStr);

  if (params !== undefined) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
}

export const kadenaHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    case 'testnet04':
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    default:
      throw new Error(`UNKNOWN_NETWORK_ID: ${networkId}`);
  }
};

export interface IExtPromise<T> {
  promise: Promise<T>;
  resolve: (result: T) => void;
  reject: (err: unknown) => void;
  fulfilled: boolean;
  data: T | undefined;
}

export const getPromise = <T>(): IExtPromise<T> => {
  let resolveFn: (value: T) => void = () => {};
  let rejectFn: (value: unknown) => void = () => {};
  let fulfilled = false;
  let result: T | undefined;

  const promise = new Promise<T>((resolve, reject) => {
    resolveFn = (data: T) => {
      result = data;
      fulfilled = true;
      resolve(data);
    };
    rejectFn = (err) => {
      fulfilled = true;
      reject(err);
    };
  });

  return {
    promise,
    resolve: resolveFn,
    reject: rejectFn,
    get fulfilled() {
      return fulfilled;
    },
    get data() {
      return result;
    },
  };
};

export const mergeAll = <T extends object>(results: Array<T>): T =>
  results.reduce((acc, data) => ({ ...acc, ...data }), {} as T);

export const mergeAllPollRequestPromises = <T extends object | string>(
  results: Array<IPollRequestPromise<T>>,
): IPollRequestPromise<T> => {
  return Object.assign(Promise.all(results).then(mergeAll), {
    requests: results.reduce(
      (acc, data) => ({ ...acc, ...data.requests }),
      {} as Record<string, Promise<T>>,
    ),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapRecord = <T extends any, Mapper extends (item: T) => any>(
  object: Record<string, T>,
  mapper: Mapper,
): Record<string, ReturnType<Mapper>> =>
  Object.fromEntries(
    Object.entries(object).map(([key, data]) => [key, mapper(data)]),
  );

export const withCounter = <
  A extends unknown[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (counter: number, ...args: [...A]) => any,
>(
  cb: F,
): ((...args: A) => ReturnType<F>) => {
  let counter = 0;
  return (...args: A): ReturnType<F> => {
    counter += 1;
    return cb(counter, ...args);
  };
};

export const sleep = (duration: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const groupByHost = (
  items: Array<{ requestKey: string; hostUrl: string }>,
): [string, string[]][] => {
  const byHost = new Map<string, string[]>();
  items.forEach(({ hostUrl, requestKey }) => {
    const prev = byHost.get(hostUrl) ?? [];
    byHost.set(hostUrl, [...prev, requestKey]);
  });
  return [...byHost.entries()];
};
