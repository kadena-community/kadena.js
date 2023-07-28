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
import { ValidDataTypes } from '../composePactCommand/utils/addData';
import { patchCommand } from '../composePactCommand/utils/patchCommand';
import {
  ICapabilityItem,
  IContinuationPayloadObject,
  IPactCommand,
} from '../interfaces/IPactCommand';
import {
  ExtractCapabilityType,
  IGeneralCapability,
} from '../interfaces/type-utilities';
import { createTransaction } from '../utils/createTransaction';

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
    capability: (
      withCapability: ExtractCapabilityType<TCommand>,
    ) => ICapabilityItem[],
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
  addData: (key: string, data: ValidDataTypes) => IBuilder<TCommand>;
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

interface IStatefullCompose {
  composeWith: (
    patch:
      | Partial<IPactCommand>
      | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>),
  ) => void;
  readonly finalize: (command: Partial<IPactCommand>) => Partial<IPactCommand>;
}

const statefullCompose = (init: Partial<IPactCommand>): IStatefullCompose => {
  let reducer: (command: Partial<IPactCommand>) => Partial<IPactCommand> =
    composePactCommand(init);
  const composeWith = (
    patch:
      | Partial<IPactCommand>
      | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>),
  ): void => {
    reducer = composePactCommand(reducer, patch);
  };
  return {
    composeWith,
    get finalize() {
      return reducer;
    },
  };
};

export const commandBuilder = (): ICommandBuilder => {
  const getBuilder = <T>(init: Partial<IPactCommand>): IBuilder<T> => {
    const state = statefullCompose(init);
    const builder: IBuilder<T> = {
      addData: (key: string, value: ValidDataTypes) => {
        state.composeWith(addData(key, value));
        return builder;
      },
      addKeyset: (key: string, pred: string, ...publicKeys: string[]) => {
        state.composeWith(addKeyset(key, pred, ...publicKeys));
        return builder;
      },
      addSigner: (pubKey, cap?: unknown) => {
        state.composeWith(
          addSigner(
            pubKey,
            cap as (withCapability: IGeneralCapability) => ICapabilityItem[],
          ) as (cmd: Partial<IPactCommand>) => Partial<IPactCommand>,
        );
        return builder;
      },
      setMeta: (meta) => {
        state.composeWith(setMeta(meta));
        return builder;
      },
      setNetworkId: (id: string) => {
        state.composeWith(setNetworkId(id));
        return builder;
      },
      setNonce: (arg: string | ((cmd: Partial<IPactCommand>) => string)) => {
        state.composeWith((cmd) => {
          const nonce = typeof arg === 'function' ? arg(cmd) : arg;
          return patchCommand(cmd, setNonce(nonce));
        });
        return builder;
      },
      getCommand: () => {
        return state.finalize({});
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
