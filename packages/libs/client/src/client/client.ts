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

/**
 * @public
 */
export interface ISubmit {
  /**
   * Submits one public (unencrypted) signed command to the blockchain for execution.
   *
   * Calls the '/send' endpoint.
   * This is the only function that requires gas payment.
   *
   * @param transaction - The transaction to be submitted.
   * @returns A promise that resolves the requestKey (the transaction hash).
   */
  (transaction: ICommand): Promise<string>;

  /**
   * Submits one or more public (unencrypted) signed commands to the blockchain for execution.
   *
   * Calls the '/send' endpoint.
   * This is the only function that requires gas payment.
   *
   * @param transactionList - The list of transactions to be submitted.
   * @returns A promise that resolves to an array of transaction hashes.
   */
  (transactionList: ICommand[]): Promise<string[]>;
}

/**
 * @public
 */
export interface IBaseClient {
  /**
   * Sends a command for non-transactional execution.
   * In a blockchain environment, this would be a node-local "dirty read".
   * Any database writes or changes to the environment are rolled back.
   * Gas payment is not required for this function.
   *
   * Calls the '/local' endpoint with optional options.
   *
   * @param transaction - The transaction to be executed.
   * @param options - Optional settings for preflight and signatureVerification.
   * @returns A promise that resolves to the local response.
   */
  local: <T extends ILocalOptions>(
    transaction: LocalRequestBody,
    options?: T,
  ) => Promise<LocalResponse<T>>;

  /**
   * Submits one or more public (unencrypted) signed commands to the blockchain for execution.
   *
   * Calls the '/send' endpoint.
   * This is the only function that requires gas payment.
   *
   * @param transactionList - The list of transactions to be submitted.
   * @returns A promise that resolves to an array of transaction hashes.
   */
  submit: ISubmit;

  /**
   * Polls the result of one or more submitted requests.
   * If requestKeys are not passed, it polls the status of all previously submitted requests.
   * Calls the '/poll' endpoint multiple times to get the status of all requests.
   *
   * @param requestKeys - Optional request keys to filter the status polling.
   * @param options - Optional network options for generating the correct host API address and options to adjust polling (onPoll, timeout, and interval).
   * @returns A promise that resolves to the poll request promise with the command result.
   */
  pollStatus: (
    requestKeys?: string[] | string,
    options?: IOptions,
  ) => IPollRequestPromise<ICommandResult>;

  /**
   * Gets the result of one or more submitted requests.
   * If requestKeys are not passed, it polls the status of all previously submitted requests.
   * If the result is not ready, it returns an empty object.
   * Calls the '/poll' endpoint only once.
   *
   * @param requestKeys - Optional request keys to filter the status polling.
   * @param options - Optional network options for generating the correct host API address.
   * @returns A promise that resolves to the poll response with the command result.
   */
  getStatus: (
    requestKeys?: string[] | string,
    options?: INetworkOptions,
  ) => Promise<IPollResponse>;

  /**
   * Listens for the result of the request. This is a long-polling process that eventually returns the result.
   * Calls the '/listen' endpoint.
   *
   * Note: If requests were submitted outside the current client context, you may need to provide networkId and chainId as options to generate the correct hostApi address.
   *
   * @param requestKey - The request key to listen for.
   * @param options - Optional network options for generating the correct host API address.
   * @returns A promise that resolves to the command result.
   */
  listen: (
    requestKey: string,
    options?: INetworkOptions,
  ) => Promise<ICommandResult>;

  /**
   * Creates an SPV proof for a request. This is required for multi-step tasks.
   * Calls the '/spv' endpoint several times to retrieve the SPV proof.
   *
   * Note: If requests were submitted outside the current client context, you may need to provide networkId and chainId as options to generate the correct hostApi address.
   *
   * @param requestKey - The request key for which the SPV proof is generated.
   * @param targetChainId - The target chain ID for the SPV proof.
   * @param options - Optional network options for generating the correct host API address and options to adjust polling (onPoll, timeout, and interval).
   * @returns A promise that resolves to the generated SPV proof.
   */
  pollCreateSpv: (
    requestKey: string,
    targetChainId: ChainId,
    options?: IOptions,
  ) => Promise<string>;

  /**
   * Creates an SPV proof for a request. This is required for multi-step tasks.
   * Calls the '/spv' endpoint only once.
   *
   * Note: If requests were submitted outside the current client context, you may need to provide networkId and chainId as options to generate the correct hostApi address.
   *
   * @param requestKey - The request key for which the SPV proof is generated.
   * @param targetChainId - The target chain ID for the SPV proof.
   * @param options - Optional network options for generating the correct host API address.
   * @returns A promise that resolves to the generated SPV proof.
   */
  createSpv: (
    requestKey: string,
    targetChainId: ChainId,
    options?: INetworkOptions,
  ) => Promise<string>;
}

/**
 * Interface for the {@link getClient | getClient()} return value
 * @public
 */
export interface IClient extends IBaseClient {
  /**
   * An alias for `local` when both preflight and signatureVerification are `true`.
   * @see local
   */
  preflight: (
    transaction: ICommand | IUnsignedCommand,
  ) => Promise<ILocalCommandResult>;

  /**
   * An alias for `local` when preflight is `false` and signatureVerification is `true`.
   *
   * @remarks
   * @see {@link IBaseClient.local | local() function}
   */
  signatureVerification: (transaction: ICommand) => Promise<ICommandResult>;

  /**
   * An alias for `local` when both preflight and signatureVerification are `false`.
   * This call has minimum restrictions and can be used to read data from the node.
   *
   * @remarks
   * @see {@link IBaseClient.local | local() function}
   */
  dirtyRead: (transaction: IUnsignedCommand) => Promise<ICommandResult>;

  /**
   * Generates a command from the code and data, then sends it to the '/local' endpoint.
   *
   * @see {@link IBaseClient.local | local() function}
   */
  runPact: (
    code: string,
    data: Record<string, unknown>,
    option: INetworkOptions,
  ) => Promise<ICommandResult>;

  /**
   * Alias for `submit`.
   * Use {@link IBaseClient.submit | submit() function}
   *
   * @deprecated Use `submit` instead.
   */
  send: ISubmit;

  /**
   * Use {@link IBaseClient.getStatus | getStatus() function}
   * Alias for `getStatus`.
   *
   * @deprecated Use `getStatus` instead.
   */
  getPoll: (
    requestKeys?: string[] | string,
    options?: INetworkOptions,
  ) => Promise<IPollResponse>;
}

/**
 * @public
 */
export interface IGetClient {
  /**
   * Generates a client instance by passing the URL of the host.
   *
   * Useful when you are working with a single network and chainId.
   * @param hostUrl - the URL to use in the client
   */
  (hostUrl: string): IClient;

  /**
   * Generates a client instance by passing a hostUrlGenerator function.
   *
   * Note: The default hostUrlGenerator creates a Kadena testnet or mainnet URL based on networkId.
   * @param hostAddressGenerator - the function that generates the URL based on `chainId` and `networkId` from the transaction
   */
  (
    hostAddressGenerator?: (options: {
      chainId: ChainId;
      networkId: string;
    }) => string,
  ): IClient;
}

/**
 * Creates Chainweb client
 * @public
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

  const client: IBaseClient = {
    local(body, options) {
      const cmd: IPactCommand = JSON.parse(body.cmd);
      const hostUrl = getHost({
        chainId: cmd.meta.chainId,
        networkId: cmd.networkId,
      });
      return local(body, hostUrl, options);
    },
    submit: (async (body) => {
      const isList = Array.isArray(body);
      const commands = isList ? body : [body];
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

      return isList ? requestKeys : requestKeys[0];
    }) as ISubmit,
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

      return mergedResults;
    },

    async listen(requestKey, options) {
      const hostUrl = getStoredHost(requestKey, options);

      const result = await listen({ listen: requestKey }, hostUrl);

      return result;
    },

    pollCreateSpv(requestKey, targetChainId, options) {
      const hostUrl = getStoredHost(requestKey, options);
      return pollSpv(hostUrl, requestKey, targetChainId, options);
    },

    async createSpv(requestKey, targetChainId, options) {
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
    dirtyRead(body) {
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
