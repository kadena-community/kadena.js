import type {
  INetworkOptions,
  IPollRequestPromise,
} from '../interfaces/interfaces';

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

/**
 *
 * @public
 * Creates endpoint url based on the baseUrl, networkId and chainId
 *
 * @example
 * const getLocalHostUrl = getHostUrl('http://localhost:8080')
 * const client = createClient(getLocalHostUrl)
 */

export const getHostUrl = (hostBaseUrl: string) => {
  const base = hostBaseUrl.endsWith('/')
    ? hostBaseUrl.slice(0, hostBaseUrl.length - 1)
    : hostBaseUrl;
  return ({ networkId, chainId }: INetworkOptions) =>
    `${base}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const kadenaHostGenerator = ({
  networkId,
  chainId,
}: INetworkOptions): string => {
  switch (networkId) {
    case 'mainnet01':
      return getHostUrl('https://api.chainweb.com')({ networkId, chainId });
    case 'testnet04':
      return getHostUrl('https://api.testnet.chainweb.com')({
        networkId,
        chainId,
      });
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
