import { IPollResponse } from '@kadena/chainweb-node-client';

import { ICommand } from '../pact';

import { ILocalOptions, local, LocalResponse } from './utils/local';
import {
  ICommandRequest,
  INetworkOptions,
  IPollOptions,
} from './utils/request';
import { getSpv, pollSpv } from './utils/spv';
import { getStatus, PollFunction, pollStatus } from './utils/status';
import { submit } from './utils/submit';

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
  submit: (
    body: ICommandRequest[],
  ) => Promise<
    [requestKeys: string[], pollStatus: () => Promise<IPollResponse>]
  >;
  pollStatus: (
    requestKeys?: string[],
    options?: IPollOptions & INetworkOptions,
  ) => Promise<IPollResponse>;
  getStatus: (
    requestKeys?: string[],
    options?: INetworkOptions,
  ) => Promise<IPollResponse>;
  pollSpv: (
    requestKey: string,
    targetChainId: string,
    options?: IPollOptions & INetworkOptions,
  ) => Promise<string>;
  getSpv: (
    requestKey: string,
    targetChainId: string,
    options?: INetworkOptions,
  ) => Promise<string>;
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
const getRequestStorage = (initial?: Map<string, string>) => {
  const storage = new Map<string, string>(initial);

  return {
    add: (hostUrl: string, requestKeys: string[]) => {
      const list = storage.get(hostUrl) ?? [];
      requestKeys.forEach((requestKey) => {
        storage.set(requestKey, hostUrl);
      });
    },
    remove: (requestKeys: string[]) => {
      requestKeys.forEach((requestKey) => {
        storage.delete(requestKey);
      });
    },
    groupByHost: () => {
      const byHost = new Map<string, string[]>();
      storage.forEach((url, requestKey) => {
        const prev = byHost.get(url) ?? [];
        byHost.set(url, [...prev, requestKey]);
      });
      return [...byHost.entries()];
    },
    getByHost: (hostUrl: string) => {
      const list: string[] = [];
      storage.forEach((url, requestKey) => {
        if (url === hostUrl) {
          list.push(requestKey);
        }
      });
      return list;
    },
    get: (requestKey: string) => storage.get(requestKey),
  };
};

export const getClient: IGetClient = (
  host: string | IHostAPIGenerator,
): IClient => {
  const getHost = typeof host === 'string' ? () => host : host;
  const storage = getRequestStorage();

  function checkPendingRequests(statusCallback: PollFunction) {
    return async (
      requestKeys?: string[],
      options?: IPollOptions & INetworkOptions,
    ) => {
      let requestStorage = storage;
      if (requestKeys !== undefined) {
        const map = new Map<string, string>(
          requestKeys.map((requestKey) => [
            requestKey,
            storage.get(requestKey) ??
              getHost(options?.networkId, options?.chainId),
          ]),
        );
        requestStorage = getRequestStorage(map);
      }
      const results = await Promise.all(
        requestStorage
          .groupByHost()
          .map(async ([hostUrl, requestKeys]) =>
            statusCallback(hostUrl, requestKeys, options),
          ),
      );

      // merge all of the result in one object
      const mergedResults = mergeAll(results);

      // remove from the pending requests storage
      storage.remove(Object.values(mergedResults).map(({ reqKey }) => reqKey));

      return mergedResults;
    };
  }

  const client: IClient = {
    local: (body, options) => {
      const cmd: ICommand = JSON.parse(body.cmd);
      const hostUrl = getHost(cmd.networkId, cmd.meta.chainId);
      return local(hostUrl, body, options);
    },
    submit: async (body) => {
      const [first] = body;
      if (first === undefined) {
        throw new Error('EMPTY_COMMAND_LIST');
      }
      const cmd: ICommand = JSON.parse(first.cmd);
      const hostUrl = getHost(cmd.networkId, cmd.meta.chainId);
      const requestIds = await submit(hostUrl, body);
      storage.add(hostUrl, requestIds);

      return [requestIds, () => pollStatus(hostUrl, requestIds)];
    },
    pollStatus: checkPendingRequests(pollStatus),
    getStatus: checkPendingRequests(getStatus),

    pollSpv: (requestKey, targetChainId, options) => {
      return pollSpv(
        getHost(options?.networkId, options?.chainId),
        requestKey,
        targetChainId,
        options,
      );
    },
    getSpv: (requestKey, targetChainId, options) => {
      return getSpv(
        getHost(options?.networkId, options?.chainId),
        requestKey,
        targetChainId,
      );
    },
  };

  return client;
};
