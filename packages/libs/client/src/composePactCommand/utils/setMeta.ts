import type {
  IPactCommand,
  IPartialPactCommand,
} from '../../interfaces/IPactCommand';
import { patchCommand } from './patchCommand';

/**
 * Reducer to set `meta` on {@link IPartialPactCommand.meta}
 * @public
 */
export const setMeta =
  (
    options: Partial<Omit<IPactCommand['meta'], 'sender'>> & {
      senderAccount?: string;
    },
  ): ((command: IPartialPactCommand) => IPartialPactCommand) =>
  (command) => {
    const { senderAccount, ...rest } = options;
    return patchCommand(command, {
      meta: {
        ...command.meta,
        ...rest,
        ...(senderAccount !== undefined ? { sender: senderAccount } : {}),
      } as IPartialPactCommand['meta'],
    });
  };
