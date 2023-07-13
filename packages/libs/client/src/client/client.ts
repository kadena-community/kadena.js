import {
  ICommandResult,
  ILocalCommandResult,
  ILocalOptions,
  IPollResponse,
  listen,
  local,
  LocalRequestBody,
  LocalResponse,
  poll,
  send,
} from '@kadena/chainweb-node-client';
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../interfaces/IPactCommand';

import { runPact } from './api/runPact';
import { getSpv, pollSpv } from './api/spv';
import { pollStatus } from './api/status';
import {
  INetworkOptions,
  IPollOptions,
  IPollRequestPromise,
} from './interfaces/interfaces';
import { getRequestStorage } from './utils/request-storege';
import {
  kadenaHostGenerator,
  mergeAll,
  mergeAllPollRequestPromises,
} from './utils/utils';

type IOptions = IPollOptions &
  (INetworkOptions | { networkId?: undefined; chainId?: undefined });

interface IClientBasics {
  /**
   * calls '/local' endpoint with options that could br also undefined,
   *
   * *Note:* the default values of preflight and signatureVerification are `true`
   */
  local: <T extends ILocalOptions>(
    transaction: LocalRequestBody,
    options?: T,
  ) => Promise<LocalResponse<T>>;

  /**
   * calls '/send' endpoint
   */
  submit: (transactionList: ICommand[] | ICommand) => Promise<string[]>;
  /**
   * calls '/poll' endpoint several times to get the status of all requests. if the requests submitted outside of the current client context then you need to path networkId
   * and chainId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  pollStatus: (
    requestKeys?: string[] | string,
    options?: IOptions,
  ) => IPollRequestPromise<ICommandResult>;

  /**
   * calls '/poll' endpoint only once. if the requests submitted outside of the current client context then you need to path networkId
   * and chainId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  getStatus: (
    requestKeys?: string[] | string,
    options?: INetworkOptions,
  ) => Promise<IPollResponse>;

  /**
   * calls '/listen' endpoint. if the requests submitted outside of the current client context then you need to path networkId
   * and chainId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  listen: (
    requestKey: string,
    options?: INetworkOptions,
  ) => Promise<ICommandResult>;

  /**
   * calls '/spv' endpoint several times to get the SPV proof. if the request submitted outside of the current client context then you need to path networkId
   * and chainId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  pollSpv: (
    requestKey: string,
    targetChainId: ChainId,
    options?: IOptions,
  ) => Promise<string>;

  /**
   * calls '/spv' endpoint only once. if the request submitted outside of the current client context then you need to path networkId
   * and chianId as the option in order to generate correct hostApi address if you passed hostApiGenerator function while initiating the client instance
   */
  getSpv: (
    requestKey: string,
    targetChainId: ChainId,
    options?: INetworkOptions,
  ) => Promise<string>;
}

interface IClient extends IClientBasics {
  /**
   * calls '/local' endpoint with both preflight and signatureVerification `true`,
   */
  preflight: (
    transaction: ICommand | IUnsignedCommand,
  ) => Promise<ILocalCommandResult>;

  /**
   * calls '/local' endpoint with preflight `false` and signatureVerification `true`,
   */
  signatureVerification: (transaction: ICommand) => Promise<ICommandResult>;

  /**
   * calls '/local' with minimum both preflight and signatureVerification `false`
   */
  dirtyReady: (transaction: IUnsignedCommand) => Promise<ICommandResult>;

  /**
   * calls '/local' with minimum both preflight and signatureVerification `false`
   */
  runPact: (
    code: string,
    data: Record<string, unknown>,
    option: INetworkOptions,
  ) => Promise<ICommandResult>;

  /**
   * @deprecated use `submit` instead
   *
   * alias fro submit
   */
  send: (transactionList: ICommand[] | ICommand) => Promise<string[]>;

  /**
   * @deprecated use `getStatus` instead
   *
   * alias getStatus
   */
  getPoll: (
    requestKeys?: string[] | string,
    options?: INetworkOptions,
  ) => Promise<IPollResponse>;
}

interface IGetClient {
  /**
   * path the url of the host if you only use one host
   */
  (hostUrl: string): IClientBasics;
  /**
   * path a function that let you decide about with host url you should be picked for each request based on networkId and chianId
   * the default value returns kadena testnet or mainnet url based on networkId
   */
  (
    hostAddressGenerator?: (options: {
      chainId: ChainId;
      networkId: string;
    }) => string,
  ): IClient;
}

/**
 * @alpha
 */
export const getClient: IGetClient = (host = kadenaHostGenerator): IClient => {
  const getHost = typeof host === 'string' ? () => host : host;
  const storage = getRequestStorage();

  const getStoredHost = (
    requestKey: string,
    options?: Partial<INetworkOptions>,
  ): string => {
    return (
      storage.get(requestKey) ??
      getHost({
        chainId: options?.chainId!,
        networkId: options?.networkId!,
      })
    );
  };

  function groupByHost(
    requestKeys?: string[],
    options?: IOptions,
  ): [string, string[]][] {
    let requestStorage = storage;
    if (requestKeys !== undefined) {
      const map = new Map<string, string>(
        requestKeys.map((requestKey) => [
          requestKey,
          getStoredHost(requestKey, options),
        ]),
      );
      requestStorage = getRequestStorage(map);
    }
    return requestStorage.groupByHost();
  }

  const client: IClientBasics = {
    local(body, options) {
      const cmd: IPactCommand = JSON.parse(body.cmd);
      const hostUrl = getHost({
        chainId: cmd.meta.chainId,
        networkId: cmd.networkId,
      });
      return local(body, hostUrl, options);
    },
    async submit(body) {
      const commands = Array.isArray(body) ? body : [body];
      const [first] = commands;
      if (first === undefined) {
        throw new Error('EMPTY_COMMAND_LIST');
      }
      const cmd: IPactCommand = JSON.parse(first.cmd);
      const hostUrl = getHost({
        chainId: cmd.meta.chainId,
        networkId: cmd.networkId,
      });
      const { requestKeys } = await send({ cmds: commands }, hostUrl);
      storage.add(hostUrl, requestKeys);

      return requestKeys;
    },
    pollStatus(
      requestKeys?: string[] | string,
      options?: IOptions,
    ): IPollRequestPromise<ICommandResult> {
      const results = groupByHost(
        typeof requestKeys === 'string' ? [requestKeys] : requestKeys,
        options,
      ).map(([hostUrl, requestKeys]) =>
        pollStatus(hostUrl, requestKeys, options),
      );

      // merge all of the result in one object
      const mergedPollRequestPromises = mergeAllPollRequestPromises(results);

      // remove from the pending requests storage
      Object.entries(mergedPollRequestPromises.requests).forEach(
        ([key, promise]) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          promise.then(() => {
            storage.remove([key]);
          });
        },
      );

      return mergedPollRequestPromises;
    },
    async getStatus(requestKeys, options) {
      const keys =
        typeof requestKeys === 'string' ? [requestKeys] : requestKeys;

      const results = await Promise.all(
        groupByHost(keys, options).map(([hostUrl, requestKeys]) =>
          poll({ requestKeys }, hostUrl),
        ),
      );

      // merge all of the result in one object
      const mergedResults = mergeAll(results);
      const receivedKeys = Object.keys(mergedResults);
      // remove from the pending requests storage
      storage.remove(receivedKeys);

      return mergedResults;
    },

    async listen(requestKey, options) {
      const hostUrl = getStoredHost(requestKey, options);

      const result = await listen({ listen: requestKey }, hostUrl);

      storage.remove([requestKey]);

      return result;
    },

    pollSpv(requestKey, targetChainId, options) {
      const hostUrl = getStoredHost(requestKey, options);
      return pollSpv(hostUrl, requestKey, targetChainId, options);
    },

    async getSpv(requestKey, targetChainId, options) {
      const hostUrl = getStoredHost(requestKey, options);
      return getSpv(hostUrl, requestKey, targetChainId);
    },
  };

  return {
    ...client,
    preflight(body) {
      return client.local(body, {
        preflight: true,
        signatureVerification: true,
      });
    },
    signatureVerification(body) {
      return client.local(body, {
        preflight: false,
        signatureVerification: true,
      });
    },
    dirtyReady(body) {
      return client.local(body, {
        preflight: false,
        signatureVerification: false,
      });
    },
    runPact: (code, data, options) => {
      const hostUrl = getHost(options);
      if (hostUrl === '') throw new Error('NO_HOST_URL');
      return runPact(hostUrl, code, data);
    },
    send: client.submit,
    getPoll: client.getStatus,
  };
};
