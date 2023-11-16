import type {
  IPactCommand,
  PartialPactCommand,
} from '../../interfaces/IPactCommand';
import { patchCommand } from './patchCommand';

/**
 * Reducer to set `meta` on {@link PartialPactCommand.meta}
 * @public
 */
export const setMeta =
  (
    options: Partial<Omit<IPactCommand['meta'], 'sender'>> & {
      senderAccount?: string;
    },
  ): ((command: PartialPactCommand) => PartialPactCommand) =>
  (command) => {
    const { senderAccount, ...rest } = options;
    return patchCommand(command, {
      meta: {
        ...command.meta,
        ...rest,
        ...(senderAccount !== undefined ? { sender: senderAccount } : {}),
      } as PartialPactCommand['meta'],
    });
  };
