import type { IPactCommand } from '../interfaces/IPactCommand';

import { patchCommand } from './utils/patchCommand';

type NoPayload<TCommand> = TCommand extends { payload: unknown }
  ? never
  : TCommand;

type DataOrFunction<TData> = TData | ((a: TData) => TData);

type InitialInput = Partial<IPactCommand> | (() => Partial<IPactCommand>);

// TODO : improve the return value to merge all of the inputs as an object
interface IComposePactCommand {
  <TPayload extends Pick<IPactCommand, 'payload'>>(
    payload: TPayload,
    ...rest: [
      ...Array<
        | Partial<IPactCommand>
        | ((payload: TPayload & Partial<IPactCommand>) => Partial<IPactCommand>)
      >,
    ]
  ): (cmd?: InitialInput) => Partial<IPactCommand>;

  (
    first: DataOrFunction<NoPayload<Partial<IPactCommand>>>,
    ...rest: Array<DataOrFunction<Partial<IPactCommand>>>
  ): (cmd?: InitialInput) => Partial<IPactCommand>;
}

const finalizeCommand = (
  command: Partial<IPactCommand>,
): Partial<IPactCommand> => {
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
    first: DataOrFunction<Partial<IPactCommand>>,
    ...rest: Array<DataOrFunction<Partial<IPactCommand>>>
  ): ((cmd?: InitialInput) => Partial<IPactCommand>) =>
  (initial: InitialInput = {}) => {
    const args: Array<
      | Partial<IPactCommand>
      | ((cmd: Partial<IPactCommand>) => Partial<IPactCommand>)
    > = [first, ...rest];
    const command = args.reduce<Partial<IPactCommand>>(
      (acc, next: unknown) => {
        return typeof next === 'function'
          ? next(acc)
          : patchCommand(acc, next as Partial<IPactCommand>);
      },
      typeof initial === 'function' ? initial() : initial,
    );
    const finalCommand = finalizeCommand(command);
    return finalCommand;
  };
