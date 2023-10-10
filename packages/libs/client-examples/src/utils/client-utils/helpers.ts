import type {
  ICommandResult,
  IPactCommand,
  ISignFunction,
} from '@kadena/client';
import type { ChainId } from '@kadena/types';

import type { Any } from '../types';

export interface IEmit {
  <Tag extends string, T>(
    tag: Tag,
  ): {
    (data: T): T;
    _event_type: [{ event: Tag; data: T }];
  };
}

export interface IClientConfig {
  host?: string | ((arg: { networkId: string; chainId: ChainId }) => string);
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
    Promise.resolve(fn(input)).then((output) => [input, output])) as Any;

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
    Promise.resolve(fn(input)).then((output) => input)) as Any;

// throw if the result is failed ; we might introduce another api for error handling
export const throwIfFails = (response: ICommandResult): ICommandResult => {
  if (response.result.status === 'success') {
    return response;
  }
  throw response.result.error;
};

export const pickFirst = <T extends Any[]>([tx]: T) => tx;
