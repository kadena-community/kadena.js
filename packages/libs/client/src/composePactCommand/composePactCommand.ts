import type { IPartialPactCommand } from '../interfaces/IPactCommand';
import { patchCommand } from './utils/patchCommand';

type NoPayload<TCommand> = TCommand extends { payload: unknown }
  ? never
  : TCommand;

type DataOrFunction<TData> = TData | ((a: TData) => TData);

type InitialInput =
  | Partial<IPartialPactCommand>
  | (() => Partial<IPartialPactCommand>);

// TODO : improve the return value to merge all of the inputs as an object
interface IComposePactCommand {
  <TPayload extends Pick<IPartialPactCommand, 'payload'>>(
    payload: TPayload,
    ...rest: [
      ...Array<
        | Partial<IPartialPactCommand>
        | ((
            payload: TPayload & Partial<IPartialPactCommand>,
          ) => Partial<IPartialPactCommand>)
      >,
    ]
  ): (cmd?: InitialInput) => Partial<IPartialPactCommand>;

  (
    first: DataOrFunction<NoPayload<Partial<IPartialPactCommand>>>,
    ...rest: Array<DataOrFunction<Partial<IPartialPactCommand>>>
  ): (cmd?: InitialInput) => Partial<IPartialPactCommand>;
}

const finalizeCommand = (
  command: Partial<IPartialPactCommand>,
): Partial<IPartialPactCommand> => {
  const dateInMs = Date.now();
  const finalCommand = { ...command };
  finalCommand.nonce ??= `kjs:nonce:${dateInMs}`;
  finalCommand.signers ??= [];
  if (finalCommand.meta) {
    const defaultMeta = {
      gasLimit: 2500,
      gasPrice: 1.0e-8,
      sender: '',
      ttl: 8 * 60 * 60, // 8 hours,
      creationTime: Math.floor(Date.now() / 1000),
    };
    finalCommand.meta = {
      ...defaultMeta,
      ...finalCommand.meta,
    };
  }
  if (finalCommand.payload && 'cont' in finalCommand.payload) {
    finalCommand.payload.cont.proof ??= null;
  }
  return finalCommand;
};

/**
 * Composer for PactCommand to use with reducers
 * @public
 */
export const composePactCommand: IComposePactCommand =
  (
    first: DataOrFunction<Partial<IPartialPactCommand>>,
    ...rest: Array<DataOrFunction<Partial<IPartialPactCommand>>>
  ): ((cmd?: InitialInput) => Partial<IPartialPactCommand>) =>
  (initial: InitialInput = {}) => {
    const args: Array<
      | Partial<IPartialPactCommand>
      | ((cmd: Partial<IPartialPactCommand>) => Partial<IPartialPactCommand>)
    > = [first, ...rest];
    const command = args.reduce<Partial<IPartialPactCommand>>(
      (acc, next: unknown) => {
        return typeof next === 'function'
          ? next(acc)
          : patchCommand(acc, next as Partial<IPartialPactCommand>);
      },
      typeof initial === 'function' ? initial() : initial,
    );
    const finalCommand = finalizeCommand(command);
    return finalCommand;
  };
