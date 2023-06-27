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
  const urlStr = `${host}${
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

export const kadenaHostGenerator = (networkId: string, chainId: string) => {
  switch (networkId) {
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    case 'testnet04':
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    default:
      throw new Error(`UNKNOWN_NETWORK_ID: ${networkId}`);
  }
};

export interface ICommandRequest {
  cmd: string;
  hash: string;
  sigs: string[];
}

export type ICommandRequestWithoutHash = Omit<ICommandRequest, 'hash'>;

export interface INetworkOptions {
  networkId: string;
  chainId: string;
}

export interface IPollOptions {
  onPoll?: (id: string) => void;
  timeout?: number;
  interval?: number;
}

export interface IExtPromise<T> {
  promise: Promise<T>;
  resolve: (result: T) => void;
  reject: (err: any) => void;
  fulfilled: boolean;
  data: T | undefined;
}

export const getPromise = <T>(): IExtPromise<T> => {
  let resolve: (value: T) => void = () => {};
  let reject: (value: any) => void = () => {};
  let fulfilled = false;
  let result: T | undefined;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = (data: T) => {
      result = data;
      fulfilled = true;
      _resolve(data);
    };
    reject = (err) => {
      fulfilled = true;
      _reject(err);
    };
  });

  return {
    promise,
    resolve,
    reject,
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

export type IPollRequestPromise<T> = Promise<Record<string, T>> & {
  requests: Record<string, Promise<T>>;
};

export const mergeAllPollRequestPromises = <T extends object>(
  results: Array<IPollRequestPromise<T>>,
): IPollRequestPromise<T> => {
  return Object.assign(Promise.all(results).then(mergeAll), {
    requests: results.reduce(
      (acc, data) => ({ ...acc, ...data.requests }),
      {} as Record<string, Promise<T>>,
    ),
  });
};

export const mapRecord = <T extends any, Mapper extends (item: T) => any>(
  object: Record<string, T>,
  mapper: Mapper,
): Record<string, ReturnType<Mapper>> =>
  Object.fromEntries(
    Object.entries(object).map(([key, data]) => [key, mapper(data)]),
  );

export const withCounter = <
  A extends any[],
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
