import { IUnsignedCommand } from '@kadena/client';
import { transactionRepository } from './transaction.repository';

export async function addTransaction(
  command: IUnsignedCommand,
  profileId: string,
  networkId: string,
  groupId?: string,
) {
  const tx = {
    uuid: crypto.randomUUID(),
    profileId,
    networkId,
    status: 'initiated' as const,
    groupId,
    ...command,
  };
  await transactionRepository.addTransaction(tx);
  return tx;
}
