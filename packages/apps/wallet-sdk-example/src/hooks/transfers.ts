import { ICrossChainTransfer, walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePendingTransfers } from '../state/pending';
import { useWalletState } from '../state/wallet';
import { useFunctionTracker } from './functionTracker';

export const useTransfers = () => {
  const wallet = useWalletState();
  const { pendingTransfers, removePendingTransfer } = usePendingTransfers();

  const trackGetTransfers = useFunctionTracker('walletSdk.getTransfers');
  const trackSubscribePendingTransactions = useFunctionTracker(
    'walletSdk.subscribePendingTransactions',
  );
  const trackSubscribeOnCrossChainComplete = useFunctionTracker(
    'walletSdk.subscribeOnCrossChainComplete',
  );

  const {
    data: transfersResponse,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', wallet.account?.name],
    enabled: !!wallet.account?.name,
    queryFn: async () => {
      if (!wallet.account?.name) return undefined;
      /**
        Without the tracking of the function, the code would look like:
        walletSdk.getTransfers({
          accountName: wallet.account.name,
          networkId: wallet.selectedNetwork,
          fungibleName: wallet.selectedFungible,
        });
       */
      return trackGetTransfers.wrap(walletSdk.getTransfers)({
        accountName: wallet.account.name,
        networkId: wallet.selectedNetwork,
        fungibleName: wallet.selectedFungible,
      });
    },
  });

  useEffect(() => {
    if (
      !transfersResponse?.transfers ||
      transfersResponse.transfers.length === 0
    ) {
      return;
    }

    const transfers = transfersResponse.transfers;
    const controller = new AbortController();

    const crossChainTransfers = transfers.filter(
      (transfer) => transfer.isCrossChainTransfer,
    ) as ICrossChainTransfer[];
    const incompleteTransfers = crossChainTransfers.filter(
      (transfer) => !transfer.continuation,
    );

    /* --- Start Demo purposes --- */
    trackSubscribeOnCrossChainComplete.setArgs({
      transfers: incompleteTransfers,
      callback: '() => refetch()',
      options: { signal: controller.signal },
    });
    /* --- End demo ---------------*/

    walletSdk.subscribeOnCrossChainComplete(
      wallet.account?.name ?? '',
      incompleteTransfers,
      () => refetch(),
      { signal: controller.signal },
    );
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, transfersResponse, wallet.account?.name]);

  useEffect(() => {
    if (!pendingTransfers || pendingTransfers.length === 0) return;
    const controller = new AbortController();

    trackSubscribePendingTransactions.setArgs({
      pendingTransfers,
      callback: '(transfer) => { ... }',
      options: { signal: controller.signal },
    });

    walletSdk.subscribePendingTransactions(
      pendingTransfers,
      (transfer) => {
        console.log('pending transfer callback', transfer);
        removePendingTransfer(transfer);
        refetch();
      },
      { signal: controller.signal },
    );
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTransfers, refetch, removePendingTransfer]);

  return {
    transfers: transfersResponse?.transfers ?? [],
    pageInfo: transfersResponse?.pageInfo ?? {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    error,
    pendingTransfers,
    account: wallet.account?.name,
    refetch,
    // demo
    functionCalls: [
      trackGetTransfers.data,
      trackSubscribePendingTransactions.data,
      trackSubscribeOnCrossChainComplete.data,
    ],
  };
};
