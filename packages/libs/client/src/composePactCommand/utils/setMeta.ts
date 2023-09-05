import type { IPactCommand } from '../../interfaces/IPactCommand';

import { patchCommand } from './patchCommand';

/**
 * Reducer to set `meta` on {@link IPactCommand.meta}
 * @public
 */
export const setMeta =
  (
    options: Partial<Omit<IPactCommand['meta'], 'sender'>> & {
      senderAccount?: string;
    },
  ): ((command: Partial<IPactCommand>) => Partial<IPactCommand>) =>
  (command) => {
    const { senderAccount, ...rest } = options;
    return patchCommand(command, {
      meta: {
        ...command.meta,
        ...rest,
        ...(senderAccount !== undefined ? { sender: senderAccount } : {}),
      } as IPactCommand['meta'],
    });
  };
