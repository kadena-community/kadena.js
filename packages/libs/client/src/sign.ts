import { ICommand, IUnsignedCommand } from '@kadena/types';

/**
 * quicksign send the command to the wallet to be signed.
 * @param command the command as string to be signed
 * @param otherSignatures map of the available signatures, in case if a multi-sig transaction already signed by some of the signers
 * @returns
 */
export const quicksign = (transaction: IUnsignedCommand): Promise<ICommand> => {
  // TODO: implement the quicksign request
  return Promise.resolve({
    cmd: transaction.cmd,
    hash: transaction.hash,
    sigs: transaction.sigs,
  } as ICommand);
};
