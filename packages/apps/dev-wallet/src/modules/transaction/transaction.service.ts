import { ChainId, IUnsignedCommand } from '@kadena/client';
import { UUID } from '../types';
import { ITransaction, transactionRepository } from './transaction.repository';

export async function addTransaction({
  transaction,
  profileId,
  networkUUID,
  groupId,
  autoContinue = false,
  crossChainId,
}: {
  transaction: IUnsignedCommand;
  profileId: string;
  networkUUID: UUID;
  groupId?: string;
  autoContinue?: boolean;
  crossChainId?: ChainId;
}) {
  const tx: ITransaction = {
    ...transaction,
    uuid: crypto.randomUUID(),
    profileId,
    networkUUID,
    status: 'initiated' as const,
    groupId,
    ...(crossChainId || autoContinue
      ? { continuation: { crossChainId, autoContinue } }
      : {}),
  };
  await transactionRepository.addTransaction(tx);
  return tx;
}
