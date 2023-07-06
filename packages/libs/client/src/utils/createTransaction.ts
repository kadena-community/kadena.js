import { hash as blakeHash } from '@kadena/cryptography-utils';
import { IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../interfaces/IPactCommand';

export const createTransaction: (
  pactCommand: IPactCommand,
) => IUnsignedCommand = (pactCommand) => {
  const cmd = JSON.stringify(pactCommand);
  const hash = blakeHash(cmd);
  return {
    cmd,
    hash,
    sigs: Array.from(Array(pactCommand.signers.length)),
  };
};
