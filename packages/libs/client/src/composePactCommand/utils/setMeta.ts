import { IPactCommand } from '../../interfaces/IPactCommand';

import { patchCommand } from './patchCommand';

/**
 * @alpha
 */
export const setMeta =
  (
    options: Partial<IPactCommand['meta']>,
  ): ((command: Partial<IPactCommand>) => Partial<IPactCommand>) =>
  (command) =>
    patchCommand(command, {
      meta: {
        ...command.meta,
        ...options,
      } as IPactCommand['meta'],
    });
