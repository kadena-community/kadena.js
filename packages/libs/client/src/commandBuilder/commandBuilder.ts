import { IUnsignedCommand } from '@kadena/types';

import {
  IContinuationPayload,
  IExecPayload,
  IPactCommand,
} from '../interfaces/IPactCommand';
import { createTransaction } from '../utils/createTransaction';
import { isPactCommand } from '../utils/isPactCommand';

export const mergePayload = (
  payload: IPactCommand['payload'] | undefined,
  newPayload: IPactCommand['payload'] | undefined,
): IExecPayload | IContinuationPayload | undefined => {
  if (payload === undefined || newPayload === undefined)
    return newPayload ?? payload;

  const mergedData: { data?: Record<string, unknown> } = {};

  // merge data
  if ('data' in payload || 'data' in newPayload) {
    mergedData.data = { ...payload.data, ...newPayload.data };
  }
  // merge code
  if ('code' in payload && 'code' in newPayload) {
    return {
      code: payload.code + newPayload.code,
      ...mergedData,
    };
  }
  // newPayload is just data
  if (Object.keys(newPayload).length === 1 && 'data' in newPayload) {
    return {
      ...payload,
      ...mergedData,
    };
  }

  // payload is just data
  if (Object.keys(payload).length === 1 && 'data' in payload) {
    return {
      ...newPayload,
      ...mergedData,
    };
  }

  throw new Error('PAYLOAD_NOT_MERGEABLE');
};

/**
 * this make the variable callable
 */
export interface ILazyPactCommandBuilder extends IPactCommandBuilder {
  /**
   * command generator function, useful when you what to compose multiple command builders or use it with FP utilities (e.g. pipe)
   */
  (initial?: Partial<IPactCommand>): Partial<IPactCommand>;
}

export interface IPactCommandBuilder {
  /**
   * Returns the merged IPactCommand Object
   */
  createPactCommand(initial?: Partial<IPactCommand>): Partial<IPactCommand>;
  /**
   * Returns transaction including \{ cmd, hash, sigs \}, in this step sig would be an array of undefined values that you need to add signatures later
   */
  createTransaction(): IUnsignedCommand;
  /**
   * validate the command to see if it has all required parts
   */
  validate(): boolean;
}

type NoPayload<T> = T extends { payload: unknown } ? never : T;

type PoF<T> = T | ((a: T) => T);

// TODO : improve the return value to merge all of the inputs as an object
interface ICommandBuilder {
  <F extends Pick<IPactCommand, 'payload'>>(
    payload: F,
    ...rest: [
      ...Array<
        | Partial<IPactCommand>
        | ((payload: F & Partial<IPactCommand>) => Partial<IPactCommand>)
        | IPactCommandBuilder
      >,
    ]
  ): ILazyPactCommandBuilder | IPactCommandBuilder;

  (
    first: PoF<NoPayload<Partial<IPactCommand>>> | IPactCommandBuilder,
    ...rest: Array<PoF<Partial<IPactCommand>> | IPactCommandBuilder>
  ): ILazyPactCommandBuilder | IPactCommandBuilder;
}

/**
 * @alpha
 */
export const commandBuilder: ICommandBuilder = (
  first: PoF<Partial<IPactCommand>> | IPactCommandBuilder,
  ...rest: Array<PoF<Partial<IPactCommand>> | IPactCommandBuilder>
) => {
  const createPactCommand = (
    initial: Partial<IPactCommand> = {},
  ): Partial<IPactCommand> => {
    const args: Array<
      | Partial<IPactCommand>
      | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>)
      | IPactCommandBuilder
    > = [first, ...rest];
    const command = args.reduce<Partial<IPactCommand>>((acc, item: unknown) => {
      const part: Partial<IPactCommand> =
        typeof item === 'function' ? item(acc) : item;
      if (part.payload !== undefined) {
        acc.payload = mergePayload(acc.payload, part.payload);
      }
      if (part.meta !== undefined) {
        acc.meta = { ...acc.meta, ...part.meta };
      }
      if (part.nonce !== undefined) {
        acc.nonce = part.nonce;
      }
      if (part.networkId !== undefined) {
        acc.networkId = part.networkId;
      }
      if (part.signers !== undefined) {
        part.signers.forEach((signer) => {
          acc.signers ??= [];
          const prev = acc.signers.find(
            ({ pubKey }) => signer.pubKey === pubKey,
          );
          if (prev !== undefined) {
            prev.clist = [...(prev.clist ?? []), ...(signer.clist ?? [])];
          } else {
            acc.signers.push(signer);
          }
        });
      }
      return acc;
    }, initial);
    const dateInMs = Date.now();
    command.nonce = command.nonce ?? `kjs:nonce:${dateInMs}`;
    if (command.meta && command.meta.creationTime === undefined) {
      command.meta.creationTime = Math.floor(dateInMs / 1000);
    }
    return command;
  };

  // make the output callable, mostly for functional programming
  return Object.assign(createPactCommand, {
    createPactCommand,
    createTransaction: () => {
      const pactCommand = createPactCommand();
      return createTransaction(pactCommand as Required<IPactCommand>);
    },
    validate: () => isPactCommand(createPactCommand()),
  });
};
