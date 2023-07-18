import { hash as blakeHash } from '@kadena/cryptography-utils';
import { IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../interfaces/IPactCommand';

/**
 * @alpha
 */
export const createTransaction: (
  pactCommand: Partial<IPactCommand>,
) => IUnsignedCommand = (pactCommand) => {
  const cmd = JSON.stringify(pactCommand, (key, value) => {
    if (typeof value === 'object' && 'moduleReference' in value) {
      return `#module-reference#${value.moduleReference}#`;
    } else {
      return value;
    }
  }).replace(/"#module-reference#(.*)#"/gi, (__, numberGroup) => numberGroup);

  const hash = blakeHash(cmd);
  return {
    cmd,
    hash,
    sigs: Array.from(Array(pactCommand.signers?.length ?? 0)),
  };
};
