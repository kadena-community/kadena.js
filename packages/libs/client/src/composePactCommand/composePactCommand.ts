import type { IPartialPactCommand } from '../interfaces/IPactCommand';
import { patchCommand } from './utils/patchCommand';

type NoPayload<TCommand> = TCommand extends { payload: unknown }
  ? never
  : TCommand;

type DataOrFunction<TData> = TData | ((a: TData) => TData);

type InitialInput = IPartialPactCommand | (() => IPartialPactCommand);

// TODO : improve the return value to merge all of the inputs as an object
interface IComposePactCommand {
  <TPayload extends Pick<IPartialPactCommand, 'payload'>>(
    payload: TPayload,
    ...rest: [
      ...Array<
        | IPartialPactCommand
        | ((payload: TPayload & IPartialPactCommand) => IPartialPactCommand)
      >,
    ]
  ): (cmd?: InitialInput) => IPartialPactCommand;

  (
    first: DataOrFunction<NoPayload<IPartialPactCommand>>,
    ...rest: Array<DataOrFunction<IPartialPactCommand>>
  ): (cmd?: InitialInput) => IPartialPactCommand;
}

const finalizeCommand = (command: IPartialPactCommand): IPartialPactCommand => {
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
    first: DataOrFunction<IPartialPactCommand>,
    ...rest: Array<DataOrFunction<IPartialPactCommand>>
  ): ((cmd?: InitialInput) => IPartialPactCommand) =>
  (initial: InitialInput = {}) => {
    const args: Array<
      IPartialPactCommand | ((cmd: IPartialPactCommand) => IPartialPactCommand)
    > = [first, ...rest];
    const command = args.reduce<IPartialPactCommand>(
      (acc, next: unknown) => {
        return typeof next === 'function'
          ? next(acc)
          : patchCommand(acc, next as IPartialPactCommand);
      },
      typeof initial === 'function' ? initial() : initial,
    );
    const finalCommand = finalizeCommand(command);
    return finalCommand;
  };
