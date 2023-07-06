import {
  IContinuationPayload,
  IExecPayload,
  IPactCommand,
} from '../interfaces/IPactCommand';

export const mergePayload = (
  payload: IPactCommand['payload'] | undefined,
  newPayload: IPactCommand['payload'] | undefined,
): IExecPayload | IContinuationPayload | undefined => {
  if (payload === undefined || newPayload === undefined)
    return newPayload ?? payload;

  if ('exec' in payload && 'exec' in newPayload) {
    return {
      exec: {
        code: (payload.exec.code ?? '') + (newPayload.exec.code ?? ''),
        data: {
          ...payload.exec.data,
          ...newPayload.exec.data,
        },
      },
    };
  }

  if ('cont' in payload && 'cont' in newPayload) {
    return {
      cont: {
        ...payload,
        ...newPayload,
        data: {
          ...payload.cont.data,
          ...newPayload.cont.data,
        },
      },
    };
  }

  throw new Error('PAYLOAD_NOT_MERGEABLE');
};

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
  ): Partial<IPactCommand>;

  (
    first: PoF<NoPayload<Partial<IPactCommand>>>,
    ...rest: Array<PoF<Partial<IPactCommand>>>
  ): Partial<IPactCommand>;
}

/**
 * @alpha
 */
export const commandBuilder: ICommandBuilder = (
  first: PoF<Partial<IPactCommand>>,
  ...rest: Array<PoF<Partial<IPactCommand>>>
): Partial<IPactCommand> => {
  const args: Array<
    | Partial<IPactCommand>
    | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>)
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
        const prev = acc.signers.find(({ pubKey }) => signer.pubKey === pubKey);
        if (prev !== undefined) {
          prev.clist = [...(prev.clist ?? []), ...(signer.clist ?? [])];
        } else {
          acc.signers.push(signer);
        }
      });
    }
    return acc;
  }, {});
  const dateInMs = Date.now();
  command.nonce = command.nonce ?? `kjs:nonce:${dateInMs}`;
  if (command.meta && command.meta.creationTime === undefined) {
    command.meta.creationTime = Math.floor(dateInMs / 1000);
  }
  return command;
};
