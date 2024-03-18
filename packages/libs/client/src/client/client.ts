import type {
  ICommandResult,
  ILocalCommandResult,
  ILocalOptions,
  IPollResponse,
  LocalRequestBody,
  LocalResponse,
} from '@kadena/chainweb-node-client';
import { listen, local, poll, send } from '@kadena/chainweb-node-client';
import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';
import type { IPactCommand } from '../interfaces/IPactCommand';
import { runPact } from './api/runPact';
import { getSpv, pollSpv } from './api/spv';
import { pollStatus } from './api/status';
import type {
  INetworkOptions,
  IPollOptions,
  IPollRequestPromise,
  Milliseconds,
} from './interfaces/interfaces';
import {
  groupByHost,
  kadenaHostGenerator,
  mergeAll,
  mergeAllPollRequestPromises,
} from './utils/utils';

/**
 * Represents the object type that the `submit` or `send` function returns,
 * which other helper functions accept as the first input.
 * This ensures that we always have enough data to fetch the request from the chain.
 * @public
 */
export interface ITransactionDescriptor {
  requestKey: string;
  chainId: ChainId;
  networkId: string;
}

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
   * @returns A promise that resolves the transactionDescriptor {@link ITransactionDescriptor}
   */
  (transaction: ICommand): Promise<ITransactionDescriptor>;

  /**
   * Submits one or more public (unencrypted) signed commands to the blockchain for execution.
   *
   * Calls the '/send' endpoint.
   * This is the only function that requires gas payment.
   *
   * @param transactionList - The list of transactions to be submitted.
   * @returns A promise that resolves the transactionDescriptor {@link ITransactionDescriptor}
   */
  (transactionList: ICommand[]): Promise<ITransactionDescriptor[]>;
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
   * @returns A promise that resolves the transactionDescriptor {@link ITransactionDescriptor}
   */
  submit: ISubmit;

  /**
   * Polls the result of one or more submitted requests.
   * Calls the '/poll' endpoint multiple times to get the status of all requests.
   *
   * @param transactionDescriptors - transaction descriptors to status polling.
   * @param options - options to adjust polling (onPoll, timeout, interval, and confirmationDepth).
   * @returns A promise that resolves to the poll request promise with the command result.
   */
  pollStatus: (
    transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor,
    options?: IPollOptions,
  ) => IPollRequestPromise<ICommandResult>;

  /**
   * Gets the result of one or more submitted requests.
   * If the result is not ready, it returns an empty object.
   * Calls the '/poll' endpoint only once.
   *
   * @param transactionDescriptors - transaction descriptors to get the status.
   * @returns  A promise that resolves to the poll response with the command result.
   */
  getStatus: (
    transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor,
  ) => Promise<IPollResponse>;

  /**
   * Listens for the result of the request. This is a long-polling process that eventually returns the result.
   * Calls the '/listen' endpoint.
   *
   *
   * @param transactionDescriptors - transaction descriptors to listen for.
   * @returns A promise that resolves to the command result.
   */
  listen: (
    transactionDescriptor: ITransactionDescriptor,
  ) => Promise<ICommandResult>;

  /**
   * Creates an SPV proof for a request. This is required for multi-step tasks.
   * Calls the '/spv' endpoint several times to retrieve the SPV proof.
   *
   *
   * @param transactionDescriptor - The request key for which the SPV proof is generated.
   * @param targetChainId - The target chain ID for the SPV proof.
   * @param options - options to adjust polling (onPoll, timeout, and interval).
   * @returns A promise that resolves to the generated SPV proof.
   */
  pollCreateSpv: (
    transactionDescriptor: ITransactionDescriptor,
    targetChainId: ChainId,
    options?: IPollOptions,
  ) => Promise<string>;

  /**
   * Creates an SPV proof for a request. This is required for multi-step tasks.
   * Calls the '/spv' endpoint only once.
   *
   *
   * @param transactionDescriptor - The transaction descriptor for which the SPV proof is generated.
   * @param targetChainId - The target chain ID for the SPV proof.
   * @returns A promise that resolves to the generated SPV proof.
   */
  createSpv: (
    transactionDescriptor: ITransactionDescriptor,
    targetChainId: ChainId,
  ) => Promise<string>;
}

/**
 * Interface for the {@link createClient | createClient()} return value
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
   * Alias for `submit` that accepts only one transaction. useful when you want more precise type checking.
   * {@link IBaseClient.submit | submit() function}
   */
  submitOne: (transaction: ICommand) => Promise<ITransactionDescriptor>;

  /**
   * Use {@link IBaseClient.getStatus | getStatus() function}
   * Alias for `getStatus`.
   *
   * @deprecated Use `getStatus` instead.
   */
  getPoll: (
    transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor,
  ) => Promise<IPollResponse>;

  /**
   * Polls the result of one request.
   * Calls the '/poll' endpoint.
   *
   *
   * @param transactionDescriptors - transaction descriptors to listen for.
   * @param options - options to adjust polling (onPoll, timeout, interval, and confirmationDepth).
   * @returns A promise that resolves to the command result.
   */
  pollOne: (
    transactionDescriptor: ITransactionDescriptor,
    options?: IPollOptions,
  ) => Promise<ICommandResult>;
}

/**
 * @public
 */
export interface ICreateClient {
  /**
   * Generates a client instance by passing the URL of the host.
   *
   * Useful when you are working with a single network and chainId.
   * @param hostUrl - the URL to use in the client
   * @param defaults - default options for the client it includes confirmationDepth that is used for polling
   */
  (hostUrl: string, defaults?: { confirmationDepth?: Milliseconds }): IClient;

  /**
   * Generates a client instance by passing a hostUrlGenerator function.
   *
   * Note: The default hostUrlGenerator creates a Kadena testnet or mainnet URL based on networkId.
   * @param hostAddressGenerator - the function that generates the URL based on `chainId` and `networkId` from the transaction
   * @param defaults - default options for the client it includes confirmationDepth that is used for polling
   */
  (
    hostAddressGenerator?: (options: {
      chainId: ChainId;
      networkId: string;
    }) => string,
    defaults?: { confirmationDepth?: Milliseconds },
  ): IClient;
}

/**
 * Creates Chainweb client
 * @public
 */
export const createClient: ICreateClient = (
  host = kadenaHostGenerator,
  defaults = { confirmationDepth: 0 },
): IClient => {
  const confirmationDepth = defaults.confirmationDepth;
  const getHost = typeof host === 'string' ? () => host : host;

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

      const transactionDescriptors = requestKeys.map((key) => ({
        requestKey: key,
        chainId: cmd.meta.chainId,
        networkId: cmd.networkId,
      }));

      return isList ? transactionDescriptors : transactionDescriptors[0];
    }) as ISubmit,
    pollStatus(
      transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor,
      options?: IPollOptions,
    ): IPollRequestPromise<ICommandResult> {
      const requestsList = Array.isArray(transactionDescriptors)
        ? transactionDescriptors
        : [transactionDescriptors];
      const results = groupByHost(
        requestsList.map(({ requestKey, chainId, networkId }) => ({
          requestKey,
          hostUrl: getHost({ chainId, networkId }),
        })),
      ).map(([hostUrl, requestKeys]) =>
        pollStatus(hostUrl, requestKeys, { confirmationDepth, ...options }),
      );

      // merge all of the result in one object
      const mergedPollRequestPromises = mergeAllPollRequestPromises(results);

      return mergedPollRequestPromises;
    },
    async getStatus(transactionDescriptors) {
      const requestsList = Array.isArray(transactionDescriptors)
        ? transactionDescriptors
        : [transactionDescriptors];

      const results = await Promise.all(
        groupByHost(
          requestsList.map(({ requestKey, chainId, networkId }) => ({
            requestKey,
            hostUrl: getHost({ chainId, networkId }),
          })),
        ).map(([hostUrl, requestKeys]) => poll({ requestKeys }, hostUrl)),
      );

      // merge all of the result in one object
      const mergedResults = mergeAll(results);

      return mergedResults;
    },

    async listen({ requestKey, chainId, networkId }) {
      const hostUrl = getHost({ chainId, networkId });

      const result = await listen({ listen: requestKey }, hostUrl);

      return result;
    },

    pollCreateSpv({ requestKey, chainId, networkId }, targetChainId, options) {
      const hostUrl = getHost({ chainId, networkId });
      return pollSpv(hostUrl, requestKey, targetChainId, options);
    },

    async createSpv({ requestKey, chainId, networkId }, targetChainId) {
      const hostUrl = getHost({ chainId, networkId });
      return getSpv(hostUrl, requestKey, targetChainId);
    },
  };

  return {
    ...client,
    submitOne: client.submit,
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
    pollOne: (transactionDescriptor, options) => {
      return client
        .pollStatus(transactionDescriptor, options)
        .then((res) => res[transactionDescriptor.requestKey]);
    },
  };
};
