import {
  ICommand,
  IContinuationPayload,
  IExecPayload,
} from '../interfaces/ICommand';

export const mergePayload = (
  payload: ICommand['payload'] | undefined,
  newPayload: ICommand['payload'] | undefined,
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

type NoPayload<T> = T extends { payload: unknown } ? never : T;

type PoF<T> = T | ((a: T) => T);

// TODO : improve the return value to merge all of the inputs as an object
interface ICommandBuilder {
  <F extends Pick<ICommand, 'payload'>>(
    payload: F,
    ...rest: [
      ...Array<
        | Partial<ICommand>
        | ((payload: F & Partial<ICommand>) => Partial<ICommand>)
      >,
    ]
  ): Partial<ICommand>;

  (
    first: PoF<NoPayload<Partial<ICommand>>>,
    ...rest: Array<PoF<Partial<ICommand>>>
  ): Partial<ICommand>;
}

/**
 * @alpha
 */
export const commandBuilder: ICommandBuilder = (
  first: PoF<Partial<ICommand>>,
  ...rest: PoF<Partial<ICommand>>[]
) => {
  const args: Array<
    Partial<ICommand> | ((cmd: Partial<ICommand>) => Partial<ICommand>)
  > = [first, ...rest];
  const command = args.reduce<Partial<ICommand>>((acc, item) => {
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
        const prev = acc.signers.find(({ pubKey }) => signer.pubKey === pubKey);
        if (prev !== undefined) {
          prev.clist = [...(prev.clist ?? []), ...(signer.clist ?? [])];
        } else {
          acc.signers.push(signer);
        }
      });
    }
    return acc;
  }, {} as Partial<ICommand>);
  const dateInMs = Date.now();
  command.nonce = command.nonce ?? `kjs:nonce:${dateInMs}`;
  if (command.meta && command.meta.creationTime === undefined) {
    command.meta.creationTime = Math.floor(dateInMs / 1000);
  }
  return command;
};
