import { ChainId, ITransactionDescriptor } from '@kadena/client';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useCallback } from 'react';

export type PendingTransfer = ITransactionDescriptor & {
  receiverAccount: string;
  senderAccount: string;
  amount: string;
  toChain?: ChainId;
};

export const pendingTransfersAtom = atomWithStorage<PendingTransfer[]>(
  'pending_transfers',
  [],
);

export const usePendingTransfers = () => {
  const [pendingTransfers, setPendingTransfers] = useAtom(pendingTransfersAtom);

  const addPendingTransfer = useCallback(
    (transfer: PendingTransfer) => {
      setPendingTransfers((prev) => [...prev, transfer]);
    },
    [setPendingTransfers],
  );

  const removePendingTransfer = useCallback(
    (transfer: ITransactionDescriptor) => {
      setPendingTransfers((prev) =>
        prev.filter((t) => t.requestKey !== transfer.requestKey),
      );
    },
    [setPendingTransfers],
  );

  return { pendingTransfers, addPendingTransfer, removePendingTransfer };
};
