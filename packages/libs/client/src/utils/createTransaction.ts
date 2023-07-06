import { hash as blakeHash } from '@kadena/cryptography-utils';
import { IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../interfaces/IPactCommand';
/**
 * @alpha
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
