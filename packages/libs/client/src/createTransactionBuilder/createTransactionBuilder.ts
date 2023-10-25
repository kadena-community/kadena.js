import type { ICap, IExecPayload, IUnsignedCommand } from '@kadena/types';
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
import type { ValidDataTypes } from '../composePactCommand/utils/addData';
import { patchCommand } from '../composePactCommand/utils/patchCommand';
import type {
  IContinuationPayloadObject,
  IPactCommand,
} from '../interfaces/IPactCommand';
import type {
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
    capability: (withCapability: ExtractCapabilityType<TCommand>) => ICap[],
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
/**
 * The interface of the return value `Pact.builder.execution` or `Pact.builder.continuation`
 *
 * @see {@link IPact}
 * @public
 */
export interface IBuilder<TCommand> {
  /**
   * Add signer with theirs capabilities
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   // add signer without scoping to any capabilities
   *   .addSigner("public_key")
   *   // add signer without scoping to the capabilities
   *   .addSigner("gas_payer_public_key",()=>[
   *       withCapability("coin.GAS"),
   *       withCapability("myModule.CAP","arg1",{ decimal: 2 })
   *    ])
   * ```
   */
  addSigner: IAddSigner<TCommand>;

  /**
   * Set meta data
   *
   * @param meta - includes sender parameter which is the account address of the gas payer
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   // select the chain and gas_payer_account
   *   .setMeta({
   *     chainId: '0',
   *     sender: 'gas_payer_account',
   *   })
   * ```
   */
  setMeta: (
    meta: Partial<Omit<IPactCommand['meta'], 'sender'>> & {
      senderAccount?: string;
    },
  ) => IBuilder<TCommand>;
  /**
   * Set nonce
   *
   * if its not presented the commandBuilder uses the default nonce generator. `kjs:nonce:timestamp`
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   .setNonce('my-custom-nonce')
   * ```
   */
  setNonce: ISetNonce<TCommand>;
  /**
   * Set network id
   *
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   .setNetworkId('mainnet01')
   * ```
   */
  setNetworkId: (id: string) => IBuilder<TCommand>;
  /**
   * add data
   *
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   .addData('theKey','theValue')
   * ```
   */
  addData: (key: string, data: ValidDataTypes) => IBuilder<TCommand>;
  /**
   * add keyset to the data part
   *
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   .addKeyset('keysetName', 'keys-all', 'fist-public-key', 'second-public-key')
   * ```
   */
  addKeyset: IAddKeyset<TCommand>;
  /**
   * finalizing the command and create the transaction object in `IUnsignedCommand` format
   *
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("albert"))
   *   // select the chain and gas_payer_account
   *   .setMeta({
   *     chainId: '0',
   *     sender: 'gas_payer_account',
   *   })
   *   // the sigs array has the same length as the signers array in the command but it fills all
   *   // by undefined which then will be replaced by the final signatures by using the wallet helpers
   *   .createTransaction(); // {cmd:"stringified command", hash:"string-hash", sigs:[undefined]}
   * ```
   */
  createTransaction: () => IUnsignedCommand;

  /**
   * finalizing the command by adding all default values.
   *
   */
  getCommand: () => Partial<IPactCommand>;
}

/**
 * @internal
 */
interface IExecution {
  <
    TCodes extends Array<
      | (string & {
          capability(name: string, ...args: unknown[]): ICap;
        })
      | string
    >,
  >(
    ...codes: [...TCodes]
  ): IBuilder<{ payload: IExecPayload & { funs: [...TCodes] } }>;
}

/**
 * @internal
 */
interface IContinuation {
  (options: IContinuationPayloadObject['cont']): IBuilder<{
    payload: IContinuationPayloadObject;
  }>;
}

/**
 * @public
 */
export interface ITransactionBuilder {
  /**
   * create execution command
   *
   * @example
   * ```
   * Pact.builder
   *   .execution(Pact.modules.coin.transfer("bob","alice", {decimal:"10"}))
   * ```
   */
  execution: IExecution;
  /**
   * create continuation command
   * @example
   * ```
   * Pact.builder
   *   .continuation({ pactId:"id", proof:"spv_proof", rollback: false , step:1 , data:{} })
   * ```
   */
  continuation: IContinuation;
}

interface IStatefulCompose {
  composeWith: (
    patch:
      | Partial<IPactCommand>
      | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>),
  ) => void;
  readonly finalize: (command: Partial<IPactCommand>) => Partial<IPactCommand>;
}

const statefulCompose = (init: Partial<IPactCommand>): IStatefulCompose => {
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

const getBuilder = <T>(init: Partial<IPactCommand>): IBuilder<T> => {
  const state = statefulCompose(init);
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
          cap as (withCapability: IGeneralCapability) => ICap[],
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

/**
 * returns a new instance of command builder
 * @param initial - the initial command
 *
 * @public
 */
export const createTransactionBuilder = (
  initial?: Partial<IPactCommand>,
): ITransactionBuilder => {
  return {
    execution: (...pactExpressions: string[]) => {
      const init = initial
        ? patchCommand(initial, execution(...pactExpressions))
        : execution(...pactExpressions);

      return getBuilder(init);
    },
    continuation: (contOptions: IContinuationPayloadObject['cont']) => {
      const init = initial
        ? patchCommand(initial, continuation(contOptions))
        : continuation(contOptions);

      return getBuilder(init);
    },
  };
};
