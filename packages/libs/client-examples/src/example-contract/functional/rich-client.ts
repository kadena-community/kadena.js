/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */

import type { ChainId, IPactCommand, ISignFunction } from '@kadena/client';
import { createClient, createTransaction } from '@kadena/client';
import { asyncPipe, composePactCommand } from '@kadena/client/fp';

import { checkSuccess, safeSign, throwIfFails } from '../util/fp-helpers';

import EventEmitter from 'events';

interface IEmit {
  <T>(tag: string): (data: T) => T;
}

const withEmitter =
  <T, Inputs extends any[]>(fn: (emit: IEmit) => (...args: Inputs) => T) =>
  (...args: Inputs) => {
    const emitter = new EventEmitter();
    const execute = fn((tag) => (data) => {
      emitter.emit(tag, data);
      return data;
    });
    const wrapper = {
      on: (event: string, cb: (data: any) => any) => {
        emitter.on(event, cb);
        return wrapper;
      },
      execute: () => execute(...args),
    };
    return wrapper;
  };

export interface IClientConfig {
  host: string | ((arg: { networkId: string; chainId: ChainId }) => string);
  defaults?: Partial<IPactCommand>;
  sign: ISignFunction;
}

export const submitAndListen = (
  { host, defaults, sign }: IClientConfig,
  client = createClient(host as any),
) =>
  withEmitter((emit: IEmit) =>
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
  client = createClient(host as any),
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
  { host, defaults, sign }: IClientConfig,
  client = createClient(host as any),
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
  host: string | ((arg: { networkId: string; chainId: ChainId }) => string);
  defaults?: Partial<IPactCommand>;
  sign: ISignFunction;
}) => {
  return {
    submitAndListen: submitAndListen({ host, defaults, sign }),
    preflight: preflight({ host, defaults, sign }),
    dirtyRead: dirtyRead({ host, defaults, sign }),
  };
};
