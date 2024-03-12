import type {
  ICommand,
  ICommandResult,
  INetworkOptions,
  IPactCommand,
  IPartialPactCommand,
  ISignFunction,
  IUnsignedCommand,
} from '@kadena/client';
import { createClient, getHostUrl, isSignedTransaction } from '@kadena/client';
import type { PactValue } from '@kadena/types';

import { composePactCommand } from '@kadena/client/fp';
import { getGlobalConfig } from '../global-config';
import type { Any } from './types';

export const inspect =
  <T extends Any>(tag: string) =>
  (data: T): T => {
    console.log(tag, data);
    return data;
  };

// TODO: check if its possible to check the correctness of the signature as well
export const validateSign = (
  tx: IUnsignedCommand,
  signedTx: ICommand | IUnsignedCommand,
): ICommand => {
  const { sigs, hash } = signedTx;
  const txWidthSigs = { ...tx, sigs };
  if (txWidthSigs.hash !== hash) {
    throw new Error('Hash mismatch');
  }
  if (!isSignedTransaction(txWidthSigs)) {
    throw new Error('Signing failed');
  }
  return txWidthSigs;
};

export const safeSign =
  (
    sign: (
      transaction: IUnsignedCommand,
    ) => Promise<IUnsignedCommand | ICommand> = getGlobalConfig().sign!,
  ) =>
  async (tx: IUnsignedCommand) => {
    if (tx.sigs.length === 0) return tx as ICommand;
    const signedTx = await sign(tx);
    return validateSign(tx, signedTx);
  };

export interface IEmit {
  <Tag extends string, T>(
    tag: Tag,
  ): {
    (data: T): T;
    _event_type: [{ event: Tag; data: T }];
  };
}

export interface IClientConfig {
  host?: string | ((options: INetworkOptions) => string);
  defaults?: Partial<IPactCommand>;
  sign: ISignFunction;
}

export interface IAccount {
  account: string;
  publicKeys?: string[];
}

export const withInput = <
  I extends Any,
  T extends { (arg: I): Any; _event_type?: Any },
>(
  fn: T,
): {
  (input: I): Promise<[input: I, output: Awaited<ReturnType<T>>]>;
  _event_type: T['_event_type'];
} =>
  ((input: I): Promise<[input: I, output: Awaited<ReturnType<T>>]> =>
    Promise.resolve()
      .then(() => fn(input))
      .then((output) => [input, output])) as Any;

export const checkSuccess = <
  I extends Any,
  T extends { (arg: I): Any; _event_type?: Any },
>(
  fn: T,
): {
  (input: I): Promise<I>;
  _event_type: T['_event_type'];
} =>
  ((input: I): Promise<I> =>
    Promise.resolve()
      .then(() => fn(input))
      .then(() => input)) as Any;

// throw if the result is failed ; we might introduce another api for error handling
export const throwIfFails = (response: ICommandResult): ICommandResult => {
  if (response.result.status !== 'success') {
    throw response.result.error;
  }
  return response;
};

export const pickFirst = <T extends Any[]>([tx]: T) => tx;

export const extractResult = <T = PactValue>(response: ICommandResult) => {
  if (response.result.status !== 'success') {
    return undefined;
  }
  return response.result.data as T;
};

export const getClient = (
  host:
    | undefined
    | string
    | ((arg: INetworkOptions) => string) = getGlobalConfig().host,
) =>
  typeof host === 'string'
    ? createClient(getHostUrl(host))
    : createClient(host);

export const asyncLock = () => {
  let res = () => {};
  let promise = Promise.resolve();
  const lock = {
    open: () => {
      res();
    },
    waitTillOpen: () => promise,
    close: () => {
      promise = new Promise((resolve) => {
        res = resolve;
      });
    },
  };
  lock.close();
  return lock;
};

type InitialInput =
  | Partial<IPartialPactCommand>
  | (() => Partial<IPartialPactCommand>);

export const composeWithDefaults =
  (
    defaults: IPartialPactCommand = {},
    globalConfig = getGlobalConfig().defaults,
  ) =>
  (cmd: InitialInput = {}) =>
    composePactCommand(defaults, cmd)(globalConfig);
