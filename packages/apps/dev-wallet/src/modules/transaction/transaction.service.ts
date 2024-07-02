import { IUnsignedCommand } from '@kadena/client';
import { transactionRepository } from './transaction.repository';

export function addTransaction(
  transaction: IUnsignedCommand,
  profileId: string,
  networkId: string,
) {
  const tx = {
    uuid: crypto.randomUUID(),
    profileId,
    networkId,
    status: 'initiated' as const,
    ...transaction,
  };
  transactionRepository.addTransaction(tx);
  return tx;
}
