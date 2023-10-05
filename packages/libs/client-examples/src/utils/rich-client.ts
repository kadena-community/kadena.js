import type { ChainId, IPactCommand, ISignFunction } from '@kadena/client';
import { createClient, createTransaction } from '@kadena/client';
import { asyncPipe, composePactCommand } from '@kadena/client/fp';

import { safeSign, throwIfFails } from '../example-contract/util/fp-helpers';

import type { Any, AnyFunc, First, IfAny, Tail } from './types';

import EventEmitter from 'events';

export interface IEmit {
  <Tag extends string, T>(
    tag: Tag,
  ): (data: T) => T & { tag: Tag; isEmit: true; data: T };
}

type EventListenerType<
  Input extends AnyFunc[],
  WrapperType = Any,
  Acc extends AnyFunc = any,
> = Input extends []
  ? Acc & ((event: string, cb: (data: unknown) => Any) => WrapperType)
  : First<Input> extends (arg: infer R) => { isEmit: true; tag: infer Tag }
  ? EventListenerType<
      Tail<Input> extends AnyFunc[] ? Tail<Input> : [],
      WrapperType,
      IfAny<
        Acc,
        (event: Tag, cb: (data: R) => Any) => WrapperType,
        Acc & ((event: Tag, cb: (data: R) => Any) => WrapperType)
      >
    >
  : EventListenerType<
      Tail<Input> extends AnyFunc[] ? Tail<Input> : [],
      WrapperType,
      Acc
    >;

export interface RT<T extends AnyFunc> {
  on: EventListenerType<ReturnType<T>['inputs'], RT<T>>;
  execute: () => ReturnType<ReturnType<T>>;
}

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

const alwaysInput = <I extends Any, T extends { (arg: I): Any; inputs: Any[] }>(
  fn: T,
): { (data: I): Promise<I>; inputs: T['inputs'] } =>
  ((data: I): Promise<I> => Promise.resolve(fn(data)).then(() => data)) as Any;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
      alwaysInput(asyncPipe(client.preflight, emit('preflight'), throwIfFails)),
      client.submitOne,
      emit('submit'),
      client.listen,
      emit('listen'),
      throwIfFails,
      emit('data'),
    ),
  );

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const dirtyRead = (
  { host, defaults }: Omit<IClientConfig, 'sign'>,
  client = createClient(host as Any),
) =>
  withEmitter((emit: IEmit) => {
    const x = asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      client.dirtyRead,
      emit('dirtyRead'),
      throwIfFails,
    );

    return x;
  });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
