import { IPollResponse } from '@kadena/chainweb-node-client';

import { ICommand } from '../pact';

import { ILocalOptions, local, LocalResponse } from './utils/local';
import {
  ICommandRequest,
  INetworkOptions,
  IPollOptions,
  kadenaHostGenerator,
} from './utils/request';
import { getSpv, pollSpv } from './utils/spv';
import { getStatus, PollFunction, pollStatus } from './utils/status';
import { submit } from './utils/submit';

const mergeAll = <T extends object>(results: Array<T>): T =>
  results.reduce((acc, data) => ({ ...acc, ...data }), {} as T);

interface IClient {
  /**
   * calls '/local' endpoint
   */
  local: <T extends ILocalOptions>(
    command: ICommandRequest,
    options?: T,
  ) => Promise<LocalResponse<T>>;
  /**
   * calls '/send' endpoint
   */
  submit: (
    commandsList: ICommandRequest[],
  ) => Promise<
    [
      requestKeys: string[],
      pollStatus: (options?: IPollOptions) => Promise<IPollResponse>,
    ]
  >;
  /**
   * calls '/poll' endpoint several times to get the status of all requests. if the requests submitted outside of the current client context then you need to path networkId
   * and chianId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  pollStatus: (
    requestKeys?: string[],
    options?: IPollOptions & INetworkOptions,
  ) => Promise<IPollResponse>;
  /**
   * calls '/poll' endpoint only once. if the requests submitted outside of the current client context then you need to path networkId
   * and chianId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  getStatus: (
    requestKeys?: string[],
    options?: INetworkOptions,
  ) => Promise<IPollResponse>;
  /**
   * calls '/spv' endpoint several times to get the SPV proof. if the request submitted outside of the current client context then you need to path networkId
   * and chianId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  pollSpv: (
    requestKey: string,
    targetChainId: string,
    options?: IPollOptions & INetworkOptions,
  ) => Promise<string>;

  /**
   * calls '/spv' endpoint only once. if the request submitted outside of the current client context then you need to path networkId
   * and chianId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
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
   * path a function that let you decide about with host url you should be picked for each request based on networkId and chianId
   * the default value returns kadena testnet or mainnet url based on networkId
   */
  (
    hostAddressGenerator?: (networkId: string, chainId: string) => string,
  ): IClient;
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

export const getClient: IGetClient = (host = kadenaHostGenerator): IClient => {
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
              getHost(options!.networkId, options!.chainId),
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

      return [
        requestIds,
        (options?: IPollOptions) =>
          checkPendingRequests(pollStatus)(requestIds, {
            ...options,
            networkId: cmd.networkId,
            chainId: cmd.meta.chainId,
          }),
      ];
    },
    pollStatus: checkPendingRequests(pollStatus),
    getStatus: checkPendingRequests(getStatus),

    pollSpv: (requestKey, targetChainId, options) => {
      return pollSpv(
        getHost(options!.networkId, options!.chainId),
        requestKey,
        targetChainId,
        options,
      );
    },
    getSpv: (requestKey, targetChainId, options) => {
      return getSpv(
        getHost(options!.networkId, options!.chainId),
        requestKey,
        targetChainId,
      );
    },
  };

  return client;
};
