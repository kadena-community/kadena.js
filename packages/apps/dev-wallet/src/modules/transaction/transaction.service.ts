import { ChainId, IUnsignedCommand } from '@kadena/client';
import { ITransaction, transactionRepository } from './transaction.repository';

export async function addTransaction({
  transaction,
  profileId,
  networkId,
  groupId,
  autoContinue = false,
  crossChainId,
}: {
  transaction: IUnsignedCommand;
  profileId: string;
  networkId: string;
  groupId?: string;
  autoContinue?: boolean;
  crossChainId?: ChainId;
}) {
  const tx: ITransaction = {
    ...transaction,
    uuid: crypto.randomUUID(),
    profileId,
    networkId,
    status: 'initiated' as const,
    groupId,
    ...(crossChainId || autoContinue
      ? { continuation: { crossChainId, autoContinue } }
      : {}),
  };
  await transactionRepository.addTransaction(tx);
  return tx;
}
