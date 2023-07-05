import { IUnsignedCommand } from '@kadena/types';

import {
  IContinuationPayload,
  IExecPayload,
  IPactCommand,
} from '../interfaces/IPactCommand';
import { isCommand } from '../utils/isCommand';

export const mergePayload = (
  payload: IPactCommand['payload'] | undefined,
  newPayload: IPactCommand['payload'] | undefined,
): IExecPayload | IContinuationPayload | undefined => {
  if (payload === undefined || newPayload === undefined)
    return newPayload ?? payload;

  const mergedData: { data?: object } = {};

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

export interface ICommandBuilderReturnType {
  (initial: Partial<IPactCommand>): Partial<IPactCommand>;
  getPactCommand(): Partial<IPactCommand>;
  getTransaction(): IUnsignedCommand;
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
      >,
    ]
  ): ICommandBuilderReturnType;

  (
    first: PoF<NoPayload<Partial<IPactCommand>>>,
    ...rest: Array<PoF<Partial<IPactCommand>>>
  ): ICommandBuilderReturnType;
}

/**
 * @alpha
 */
export const commandBuilder: ICommandBuilder = (
  first: PoF<Partial<IPactCommand>>,
  ...rest: PoF<Partial<IPactCommand>>[]
) => {
  const generateCommand = (initial: Partial<IPactCommand> = {}) => {
    const args: Array<
      | Partial<IPactCommand>
      | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>)
    > = [first, ...rest];
    const command = args.reduce<Partial<IPactCommand>>((acc, item) => {
      const part = typeof item === 'function' ? item(acc) : item;
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
  const getPactCommand = () => generateCommand();
  const getTransaction = () => {
    const pactCommand = getPactCommand();
    return {
      cmd: JSON.stringify(pactCommand),
      hash: 'hash',
      sigs: pactCommand.signers?.map(() => undefined) ?? [],
    } as IUnsignedCommand;
  };
  return Object.assign(generateCommand, {
    getPactCommand,
    getTransaction,
    validate: () => isCommand(getPactCommand()),
  });
};
