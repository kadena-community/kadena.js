import { IExecPayload, IUnsignedCommand } from '@kadena/types';

import {
  addData,
  addKeyset,
  addSigner,
  createPactCommand,
  payload,
  setMeta,
  setNetworkId,
  setNonce,
} from '../createPactCommand';
import { UnionToIntersection } from '../createPactCommand/utils/addSigner';
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

interface IAddKeyset<T> {
  <TKey extends string, PRED extends 'keys-all' | 'keys-one' | 'keys-two'>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): IBuilder<T>;

  <TKey extends string, PRED extends string>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): IBuilder<T>;
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
  addData: (
    key: string,
    data: Record<string, unknown> | string | number | boolean,
  ) => IBuilder<T>;
  addKeyset: IAddKeyset<T>;
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

export interface ICommandBuilder {
  execute: IExec;
  continuation: ICont;
}

export const commandBuilder = (): ICommandBuilder => {
  const getBuilder = <T>(init: Partial<IPactCommand>): IBuilder<T> => {
    let command: Partial<IPactCommand> = init;
    const builder: IBuilder<T> = {
      addData: (
        key: string,
        value: Record<string, unknown> | string | number | boolean,
      ) => {
        command = createPactCommand(addData(key, value))(command);
        return builder;
      },
      addKeyset: (key: string, pred: string, ...publicKeys: string[]) => {
        command = createPactCommand(addKeyset(key, pred, ...publicKeys))(
          command,
        );
        return builder;
      },
      addSigner: (pubKey, cap?: unknown) => {
        command = createPactCommand(
          addSigner(
            pubKey,
            cap as (withCapability: CAP) => ICapabilityItem[],
          ) as (cmd: Partial<IPactCommand>) => Partial<IPactCommand>,
        )(command);
        return builder;
      },
      setMeta: (meta) => {
        command = createPactCommand(setMeta(meta))(command);
        return builder;
      },
      setNetworkId: (id: string) => {
        command = createPactCommand(setNetworkId(id))(command);
        return builder;
      },
      setNonce: (arg: string | ((cmd: Partial<IPactCommand>) => string)) => {
        const nonce = typeof arg === 'function' ? arg(command) : arg;
        command = createPactCommand(setNonce(nonce))(command);
        return builder;
      },
      getCommand: () => {
        command = createPactCommand(command)();
        return command;
      },
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
