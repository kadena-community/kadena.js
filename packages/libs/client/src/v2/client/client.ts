import { IPollResponse } from '@kadena/chainweb-node-client';

import { ICommand } from '../pact';

import { ILocalOptions, local, LocalResponse } from './utils/local';
import { IPollUntilOptions, poll, PollFunction, pollUntil } from './utils/poll';
import { ICommandRequest } from './utils/request';
import { send } from './utils/send';

const mergeAll = <T extends object>(results: Array<T>): T =>
  results.reduce((acc, data) => ({ ...acc, ...data }), {} as T);

interface IHostAPIGenerator {
  (networkId?: string, chainId?: string): string;
}

interface IClient {
  local: <T extends ILocalOptions>(
    body: ICommandRequest,
    options: T,
  ) => Promise<LocalResponse<T>>;
  send: (
    body: ICommandRequest[],
  ) => Promise<[requestIds: string[], poll: () => Promise<IPollResponse>]>;
  poll: () => Promise<IPollResponse>;
  pollUntil: (options?: IPollUntilOptions) => Promise<IPollResponse>;
}

interface IGetClient {
  /**
   * path the url of the host if you only use one host
   */
  (hostUrl: string): IClient;
  /**
   * path a function that let you decide about with host url you should be picked for each transaction
   */
  (hostAddressGenerator: IHostAPIGenerator): IClient;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getRequestStorage = () => {
  const storage = new Map<
    string,
    Array<{ requestKey: string; chainId: string }>
  >();

  return {
    add: (hostUrl: string, requestKeys: string[], chainId: string) => {
      const list = storage.get(hostUrl) ?? [];
      storage.set(hostUrl, [
        ...list,
        ...requestKeys.map((requestKey) => ({ requestKey, chainId })),
      ]);
    },
    remove: (hostUrl: string, requestKeys: string[]) => {
      const list = storage.get(hostUrl);
      if (list === undefined) return;
      const filteredList = list.filter(
        ({ requestKey }) => !requestKeys.includes(requestKey),
      );
      storage.set(hostUrl, filteredList);
    },
    getEntries: () => [...storage.entries()],
    get: (key: string) => storage.get(key),

    poll,
  };
};

export const getClient: IGetClient = (
  host: string | IHostAPIGenerator,
): IClient => {
  const getHost = typeof host === 'string' ? () => host : host;
  const storage = getRequestStorage();

  function doPoll(pollCallback: PollFunction): () => Promise<IPollResponse> {
    return async (options?: IPollUntilOptions) => {
      const results = await Promise.all(
        storage.getEntries().map(async ([hostUrl, requestIds]) => {
          const result = await pollCallback(
            hostUrl,
            requestIds.map(({ requestKey }) => requestKey),
            options,
          );
          return [hostUrl, result] as const;
        }),
      );

      Object.values(results).forEach(([hostUrl, result]) =>
        storage.remove(
          hostUrl,
          Object.values(result).map(({ reqKey }) => reqKey),
        ),
      );

      return mergeAll(results.map(([, result]) => result));
    };
  }

  const client: IClient = {
    local: (body, options) => {
      const cmd: ICommand = JSON.parse(body.cmd);
      const hostUrl = getHost(cmd.networkId, cmd.meta.chainId);
      return local(hostUrl, body, options);
    },
    send: async (body) => {
      const [first] = body;
      if (first === undefined) {
        throw new Error('EMPTY_COMMAND_LIST');
      }
      const cmd: ICommand = JSON.parse(first.cmd);
      const hostUrl = getHost(cmd.networkId, cmd.meta.chainId);
      const requestIds = await send(hostUrl, body);
      storage.add(hostUrl, requestIds, cmd.meta.chainId);

      return [requestIds, () => pollUntil(hostUrl, requestIds)];
    },
    poll: doPoll(poll),
    pollUntil: doPoll(pollUntil),
  };

  return client;
};
