import { IExecPayload, IUnsignedCommand } from '@kadena/types';

import {
  addSigner,
  commandBuilder,
  payload,
  setMeta,
  setProp,
} from '../commandBuilder';
import { UnionToIntersection } from '../commandBuilder/utils/addSigner';
import {
  ICapabilityItem,
  IContinuationPayload,
  IPactCommand,
} from '../interfaces/IPactCommand';
import { createTransaction } from '../utils/createTransaction';

type CAP = (name: string, ...args: unknown[]) => ICapabilityItem;

export type ExtractType<T> = T extends { payload: infer A }
  ? A extends { funs: infer F }
    ? F extends Array<infer I>
      ? UnionToIntersection<I> extends { capability: infer C }
        ? C
        : CAP
      : CAP
    : CAP
  : CAP;

interface IAddSigner<T> {
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  ): IBuilder<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
    capability: (withCapability: ExtractType<T>) => ICapabilityItem[],
  ): IBuilder<T>;
}

interface ISetNonce<T> {
  (nonce: string): IBuilder<T>;
  (nonceGenerator: (cmd: Partial<IPactCommand>) => string): IBuilder<T>;
}

interface IBuilder<T> {
  addSigner: IAddSigner<T>;
  setMeta: (
    meta: { chainId: IPactCommand['meta']['chainId'] } & Partial<
      IPactCommand['meta']
    >,
  ) => IBuilder<T>;
  setNonce: ISetNonce<T>;
  setNetworkId: (id: string) => IBuilder<T>;
  createTransaction: () => IUnsignedCommand;
  getCommand: () => Partial<IPactCommand>;
}

export interface IExec {
  <
    T extends Array<
      | (string & {
          capability(name: string, ...args: unknown[]): ICapabilityItem;
        })
      | string
    >,
  >(
    ...codes: [...T]
  ): // use _branch to add type inferring for using it when user call signer function then we can show a related list of capabilities
  IBuilder<{ payload: IExecPayload & { funs: [...T]; _brand: 'exec' } }>;
}

export interface ICont {
  (options: IContinuationPayload['cont']): IBuilder<{
    payload: IContinuationPayload;
  }>;
}

export interface IFluentBuilder {
  execute: IExec;
  continuation: ICont;
}

export const createFluentBuilder = (): IFluentBuilder => {
  const getBuilder = <T>(init: Partial<IPactCommand>): IBuilder<T> => {
    let command: Partial<IPactCommand> = init;
    const builder: IBuilder<T> = {
      addSigner: (pubKey, cap?: unknown) => {
        command = commandBuilder(
          command,
          addSigner(
            pubKey,
            cap as (withCapability: CAP) => ICapabilityItem[],
          ) as (cmd: Partial<IPactCommand>) => Partial<IPactCommand>,
        );
        return builder;
      },
      setMeta: (meta) => {
        command = commandBuilder(command, setMeta(meta));
        return builder;
      },
      setNetworkId: (id: string) => {
        command = commandBuilder(command, setProp('networkId', id));
        return builder;
      },
      setNonce: (arg: string | ((cmd: Partial<IPactCommand>) => string)) => {
        const nonce = typeof arg === 'function' ? arg(command) : arg;
        command = commandBuilder(command, setProp('nonce', nonce));
        return builder;
      },
      getCommand: () => commandBuilder(command),
      createTransaction: () => createTransaction(builder.getCommand()),
    };
    return builder;
  };
  return {
    execute: (...codes: string[]) => {
      return getBuilder(payload.exec(...codes));
    },
    continuation: (contOptions: IContinuationPayload['cont']) => {
      return getBuilder(payload.cont(contOptions));
    },
  };
};
