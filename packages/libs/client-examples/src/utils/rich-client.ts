/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */

import type {
  ChainId,
  IClient,
  IPactCommand,
  ISignFunction,
} from '@kadena/client';
import { createClient, createTransaction } from '@kadena/client';
import { asyncPipe, composePactCommand, execution } from '@kadena/client/fp';

import type { First, Tail } from '../example-contract/util/asyncPipe';
import {
  checkSuccess,
  safeSign,
  throwIfFails,
} from '../example-contract/util/fp-helpers';

import EventEmitter from 'events';

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export interface IEmit {
  <Tag extends string, T>(
    tag: Tag,
  ): (data: T) => T & { tag: Tag; isEmit: true };
}

type AnyFunc = (...arg: Any) => Any;

type OnFunctionType<
  Input extends AnyFunc[],
  WrapperType = Any,
  Acc extends AnyFunc = Any,
> = Input extends []
  ? Acc
  : First<Input> extends (arg: infer R) => { isEmit: true; tag: infer Tag }
  ? OnFunctionType<
      Tail<Input> extends AnyFunc[] ? Tail<Input> : [],
      WrapperType,
      IfAny<
        Acc,
        (event: Tag, cb: (data: R) => Any) => WrapperType,
        Acc & ((event: Tag, cb: (data: R) => Any) => WrapperType)
      >
    >
  : OnFunctionType<
      Tail<Input> extends AnyFunc[] ? Tail<Input> : [],
      WrapperType,
      Acc
    >;

export type RT<T extends AnyFunc> = {
  on: OnFunctionType<ReturnType<T>['inputs'], RT<T>>;
  execute: () => ReturnType<ReturnType<T>>;
};

type WithEmitter = <T extends (emit: IEmit) => Any>(
  fn: T,
) => (...args: Parameters<ReturnType<T>>) => RT<T>;

const withEmitter: WithEmitter =
  (fn) =>
  (...args: Any[]): Any => {
    const emitter = new EventEmitter();
    const execute = fn((tag) => (data: Any) => {
      emitter.emit(tag, data);
      return data;
    });
    const wrapper = {
      on: (event: string, cb: (data: Any) => Any) => {
        emitter.on(event, cb);
        return wrapper;
      },
      execute: () => execute(...args),
    };
    return wrapper;
  };

export interface IClientConfig {
  host?: string | ((arg: { networkId: string; chainId: ChainId }) => string);
  defaults?: Partial<IPactCommand>;
  sign: ISignFunction;
}

export const submitAndListen = (
  { host, defaults, sign }: IClientConfig,
  client = createClient(host as Any),
) =>
  withEmitter((emit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      safeSign(sign),
      emit('sign'),
      checkSuccess(client.preflight),
      emit('preflight'),
      client.submitOne,
      emit('submit'),
      client.listen,
      emit('listen'),
      throwIfFails,
      emit('data'),
    ),
  );

export const preflight = (
  { host, defaults, sign }: IClientConfig,
  client = createClient(host as Any),
) =>
  withEmitter((emit: IEmit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      safeSign(sign),
      emit('sign'),
      client.preflight,
      emit('preflight'),
      throwIfFails,
    ),
  );

export const dirtyRead = (
  { host, defaults }: Omit<IClientConfig, 'sign'>,
  client = createClient(host as Any),
) =>
  withEmitter((emit: IEmit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      client.dirtyRead,
      emit('dirtyRead'),
      throwIfFails,
    ),
  );

export const createRichClient = ({
  host,
  defaults,
  sign,
}: {
  host?: string | ((arg: { networkId: string; chainId: ChainId }) => string);
  defaults?: Partial<IPactCommand>;
  sign: ISignFunction;
}) => {
  return {
    submitAndListen: submitAndListen({ host, defaults, sign }),
    preflight: preflight({ host, defaults, sign }),
    dirtyRead: dirtyRead({ host, defaults }),
  };
};
