import { hash as blakeHash } from '@kadena/cryptography-utils';
import { IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../interfaces/IPactCommand';

/**
 * Prepare a transaction object. Creates an object with hash, cmd and sigs ({@link @kadena/types#IUnsignedCommand})
 * @public
 */
export const createTransaction: (
  pactCommand: Partial<IPactCommand>,
) => IUnsignedCommand = (pactCommand) => {
  const cmd = JSON.stringify(pactCommand);

  // TODO: some wallets might need this,
  //   when they cannot work with {decimal: string} objects

  // const cmd = JSON.stringify(pactCommand, (key, value) => {
  //   if (typeof value === 'object' && 'decimal' in value) {
  //     return `#decimal#${value.decimal}#`;
  //   } else {
  //     return value;
  //   }
  // }).replace(/"#decimal#(.*)#"/, (__, numberGroup) => numberGroup);

  const hash = blakeHash(cmd);
  return {
    cmd,
    hash,
    sigs: Array.from(Array(pactCommand.signers?.length ?? 0)),
  };
};
