import { IExecPayload, IUnsignedCommand } from '@kadena/types';

import {
  addData,
  addKeyset,
  addSigner,
  composePactCommand,
  continuation,
  execution,
  setMeta,
  setNetworkId,
  setNonce,
} from '../composePactCommand';
import { UnionToIntersection } from '../composePactCommand/utils/addSigner';
import {
  ICapabilityItem,
  IContinuationPayloadObject,
  IPactCommand,
} from '../interfaces/IPactCommand';
import { createTransaction } from '../utils/createTransaction';

type GeneralCapability = (name: string, ...args: unknown[]) => ICapabilityItem;

export type ExtractType<TCommand> = TCommand extends { payload: infer TPayload }
  ? TPayload extends { funs: infer TFunctions }
    ? TFunctions extends Array<infer TFunction>
      ? UnionToIntersection<TFunction> extends { capability: infer TCapability }
        ? TCapability
        : GeneralCapability
      : GeneralCapability
    : GeneralCapability
  : GeneralCapability;

interface IAddSigner<TCommand> {
  /**
   * Add signer without capability
   */
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  ): IBuilder<TCommand>;
  /**
   * Add a signer including capabilities. The withCapability function is obtained from
   * the function you call in the execution part.
   * @example
   * Pact.builder.execute(
   *   Pact.coin.transfer("alice", "bob", \{ decimal:"1" \})
   * ).addSigner("public_key", (withCapability) =\> [
   *   withCapability("coin.GAS"),
   *   withCapability("coin.TRANSFER", "alice", "bob", \{ decimal:"1" \})
   * ])
   */
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
    capability: (withCapability: ExtractType<TCommand>) => ICapabilityItem[],
  ): IBuilder<TCommand>;
}

interface ISetNonce<TCommand> {
  /**
   * Overriding the default nonce by calling this function
   */
  (nonce: string): IBuilder<TCommand>;
  /**
   * Overriding the default nonce by calling this function. The `nonceGenerator` function will receive the command object
   * and should return the nonce as a string.
   */
  (nonceGenerator: (cmd: Partial<IPactCommand>) => string): IBuilder<TCommand>;
}

interface IAddKeyset<TCommand> {
  <TKey extends string, PRED extends 'keys-all' | 'keys-one' | 'keys-two'>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): IBuilder<TCommand>;

  <TKey extends string, PRED extends string>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): IBuilder<TCommand>;
}
interface IBuilder<TCommand> {
  addSigner: IAddSigner<TCommand>;
  setMeta: (
    meta: { chainId: IPactCommand['meta']['chainId'] } & Partial<
      IPactCommand['meta']
    >,
  ) => IBuilder<TCommand>;
  setNonce: ISetNonce<TCommand>;
  setNetworkId: (id: string) => IBuilder<TCommand>;
  addData: (
    key: string,
    data: Record<string, unknown> | string | number | boolean,
  ) => IBuilder<TCommand>;
  addKeyset: IAddKeyset<TCommand>;
  createTransaction: () => IUnsignedCommand;
  getCommand: () => Partial<IPactCommand>;
}

export interface IExec {
  <
    TCodes extends Array<
      | (string & {
          capability(name: string, ...args: unknown[]): ICapabilityItem;
        })
      | string
    >,
  >(
    ...codes: [...TCodes]
  ): IBuilder<{ payload: IExecPayload & { funs: [...TCodes] } }>;
}

export interface ICont {
  (options: IContinuationPayloadObject['cont']): IBuilder<{
    payload: IContinuationPayloadObject;
  }>;
}

export interface ICommandBuilder {
  execution: IExec;
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
        command = composePactCommand(addData(key, value))(command);
        return builder;
      },
      addKeyset: (key: string, pred: string, ...publicKeys: string[]) => {
        command = composePactCommand(addKeyset(key, pred, ...publicKeys))(
          command,
        );
        return builder;
      },
      addSigner: (pubKey, cap?: unknown) => {
        command = composePactCommand(
          addSigner(
            pubKey,
            cap as (withCapability: GeneralCapability) => ICapabilityItem[],
          ) as (cmd: Partial<IPactCommand>) => Partial<IPactCommand>,
        )(command);
        return builder;
      },
      setMeta: (meta) => {
        command = composePactCommand(setMeta(meta))(command);
        return builder;
      },
      setNetworkId: (id: string) => {
        command = composePactCommand(setNetworkId(id))(command);
        return builder;
      },
      setNonce: (arg: string | ((cmd: Partial<IPactCommand>) => string)) => {
        const nonce = typeof arg === 'function' ? arg(command) : arg;
        command = composePactCommand(setNonce(nonce))(command);
        return builder;
      },
      getCommand: () => {
        command = composePactCommand(command)();
        return command;
      },
      createTransaction: () => createTransaction(builder.getCommand()),
    };
    return builder;
  };
  return {
    execution: (...codes: string[]) => {
      return getBuilder(execution(...codes));
    },
    continuation: (contOptions: IContinuationPayloadObject['cont']) => {
      return getBuilder(continuation(contOptions));
    },
  };
};
