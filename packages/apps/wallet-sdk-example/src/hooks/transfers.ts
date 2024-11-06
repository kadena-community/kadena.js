import { walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePendingTransfers } from '../state/pending';
import { useWalletState } from '../state/wallet';

export const useTransfers = () => {
  const wallet = useWalletState();
  const { pendingTransfers, removePendingTransfer } = usePendingTransfers();

  const {
    data: transfers,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', wallet.account?.publicKey],
    enabled: !!wallet.account,
    queryFn: () =>
      walletSdk.getTransfers(
        wallet.account?.name ?? '',
        wallet.selectedNetwork,
        wallet.selectedFungible,
      ),
  });

  useEffect(() => {
    if (!transfers) return;
    const controller = new AbortController();
    walletSdk.subscribeOnCrossChainComplete(transfers, () => refetch(), {
      signal: controller.signal,
    });
    return () => controller.abort();
  }, [transfers, refetch]);

  useEffect(() => {
    const controller = new AbortController();
    walletSdk.subscribePendingTransactions(
      pendingTransfers,
      (transfer) => {
        console.log('pending transfer callback', transfer);
        removePendingTransfer(transfer);
        refetch();
      },
      {
        signal: controller.signal,
      },
    );
    return () => controller.abort();
  }, [pendingTransfers, refetch, removePendingTransfer]);

  return { transfers: transfers ?? [], error, pendingTransfers, refetch };
};
