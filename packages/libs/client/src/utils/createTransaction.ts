import { hash as blakeHash } from '@kadena/cryptography-utils';
import { IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../interfaces/IPactCommand';

export const createTransaction = (
  pactCommand: Partial<IPactCommand>,
): IUnsignedCommand => {
  const cmd = JSON.stringify(pactCommand);
  const hash = blakeHash(cmd);
  return {
    cmd,
    hash,
    sigs: Array.from(Array(pactCommand.signers?.length)),
  };
};
