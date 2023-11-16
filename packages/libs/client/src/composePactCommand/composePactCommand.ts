import type { PartialPactCommand } from '../interfaces/IPactCommand';
import { patchCommand } from './utils/patchCommand';

type NoPayload<TCommand> = TCommand extends { payload: unknown }
  ? never
  : TCommand;

type DataOrFunction<TData> = TData | ((a: TData) => TData);

type InitialInput =
  | Partial<PartialPactCommand>
  | (() => Partial<PartialPactCommand>);

// TODO : improve the return value to merge all of the inputs as an object
interface IComposePactCommand {
  <TPayload extends Pick<PartialPactCommand, 'payload'>>(
    payload: TPayload,
    ...rest: [
      ...Array<
        | Partial<PartialPactCommand>
        | ((
            payload: TPayload & Partial<PartialPactCommand>,
          ) => Partial<PartialPactCommand>)
      >,
    ]
  ): (cmd?: InitialInput) => Partial<PartialPactCommand>;

  (
    first: DataOrFunction<NoPayload<Partial<PartialPactCommand>>>,
    ...rest: Array<DataOrFunction<Partial<PartialPactCommand>>>
  ): (cmd?: InitialInput) => Partial<PartialPactCommand>;
}

const finalizeCommand = (
  command: Partial<PartialPactCommand>,
): Partial<PartialPactCommand> => {
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
  return finalCommand;
};

/**
 * Composer for PactCommand to use with reducers
 * @public
 */
export const composePactCommand: IComposePactCommand =
  (
    first: DataOrFunction<Partial<PartialPactCommand>>,
    ...rest: Array<DataOrFunction<Partial<PartialPactCommand>>>
  ): ((cmd?: InitialInput) => Partial<PartialPactCommand>) =>
  (initial: InitialInput = {}) => {
    const args: Array<
      | Partial<PartialPactCommand>
      | ((cmd: Partial<PartialPactCommand>) => Partial<PartialPactCommand>)
    > = [first, ...rest];
    const command = args.reduce<Partial<PartialPactCommand>>(
      (acc, next: unknown) => {
        return typeof next === 'function'
          ? next(acc)
          : patchCommand(acc, next as Partial<PartialPactCommand>);
      },
      typeof initial === 'function' ? initial() : initial,
    );
    const finalCommand = finalizeCommand(command);
    return finalCommand;
  };
