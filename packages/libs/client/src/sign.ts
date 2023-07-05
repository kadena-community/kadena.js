import { ICommand, IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from './interfaces/IPactCommand';
import { isCommand } from './utils/isCommand';

/**
 * quicksign send the command to the wallet to be signed.
 * @param command the command as string to be signed
 * @param otherSignatures map of the available signatures, in case if a multi-sig transaction already signed by some of the signers
 * @returns
 */
export const quicksign = (transaction: IUnsignedCommand): Promise<ICommand> => {
  const commandJSon: Partial<IPactCommand> = JSON.parse(transaction.cmd);

  if (isCommand(commandJSon)) {
    // TODO: implement the quicksign request
    return Promise.resolve({
      cmd: transaction.cmd,
      hash: transaction.hash,
      sigs: transaction.sigs,
    } as ICommand);
  }
  return Promise.reject(new Error('INVALID_COMMAND'));
};
