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
        ...(payload.exec.data || newPayload.exec.data
          ? {
              data: {
                ...payload.exec.data,
                ...newPayload.exec.data,
              },
            }
          : {}),
      },
    };
  }

  if ('cont' in payload && 'cont' in newPayload) {
    return {
      cont: {
        ...payload.cont,
        ...newPayload.cont,
        ...(payload.cont.data || newPayload.cont.data
          ? {
              data: {
                ...payload.cont.data,
                ...newPayload.cont.data,
              },
            }
          : {}),
      },
    };
  }

  throw new Error('PAYLOAD_NOT_MERGEABLE');
};

type NoPayload<TCommand> = TCommand extends { payload: unknown }
  ? never
  : TCommand;

type DataOrFunction<TData> = TData | ((a: TData) => TData);

// TODO : improve the return value to merge all of the inputs as an object
interface ICreatePactCommand {
  <TPayload extends Pick<IPactCommand, 'payload'>>(
    payload: TPayload,
    ...rest: [
      ...Array<
        | Partial<IPactCommand>
        | ((payload: TPayload & Partial<IPactCommand>) => Partial<IPactCommand>)
      >,
    ]
  ): (cmd?: Partial<IPactCommand>) => Partial<IPactCommand>;

  (
    first: DataOrFunction<NoPayload<Partial<IPactCommand>>>,
    ...rest: Array<DataOrFunction<Partial<IPactCommand>>>
  ): (cmd?: Partial<IPactCommand>) => Partial<IPactCommand>;
}

/**
 * @alpha
 */
export const createPactCommand: ICreatePactCommand =
  (
    first: DataOrFunction<Partial<IPactCommand>>,
    ...rest: Array<DataOrFunction<Partial<IPactCommand>>>
  ): ((cmd?: Partial<IPactCommand>) => Partial<IPactCommand>) =>
  (initial: Partial<IPactCommand> = {}) => {
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
    command.nonce ??= `kjs:nonce:${dateInMs}`;
    command.signers ??= [];
    if (command.meta && command.meta.creationTime === undefined) {
      command.meta.creationTime = Math.floor(dateInMs / 1000);
    }
    return command;
  };
