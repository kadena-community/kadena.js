import { ITransactionDescriptor } from '@kadena/client';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type PendingTransfer = ITransactionDescriptor & {
  receiverAccount: string;
  senderAccount: string;
  amount: string;
};

export const pendingTransfersAtom = atomWithStorage<PendingTransfer[]>(
  'pending_transfers',
  [],
);

export const usePendingTransfers = () => {
  const [pendingTransfers, setPendingTransfers] = useAtom(pendingTransfersAtom);

  const addPendingTransfer = (transfer: PendingTransfer) => {
    setPendingTransfers((prev) => [...prev, transfer]);
  };

  const removePendingTransfer = (transfer: ITransactionDescriptor) => {
    setPendingTransfers((prev) =>
      prev.filter((t) => t.requestKey !== transfer.requestKey),
    );
  };

  return { pendingTransfers, addPendingTransfer, removePendingTransfer };
};
