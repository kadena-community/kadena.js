import { hash as blakeHash } from '@kadena/cryptography-utils';
import type { IUnsignedCommand } from '@kadena/types';

import type { IPactCommand } from '../interfaces/IPactCommand';

/**
 * Prepare a transaction object. Creates an object with hash, cmd and sigs ({@link @kadena/types#IUnsignedCommand})
 * @public
 */
export const createTransaction: (
  pactCommand: Partial<IPactCommand>,
) => IUnsignedCommand = (pactCommand) => {
  const cmd = JSON.stringify(pactCommand);
  const hash = blakeHash(cmd);
  return {
    cmd,
    hash,
    sigs: Array.from(Array(pactCommand.signers?.length ?? 0)),
  };
};
