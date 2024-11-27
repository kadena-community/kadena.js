import { walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { usePendingTransfers } from '../state/pending';
import { useWalletState } from '../state/wallet';

interface FunctionCall {
  functionName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functionArgs: any;
}

export const useTransfers = () => {
  const wallet = useWalletState();
  const { pendingTransfers, removePendingTransfer } = usePendingTransfers();

  const [functionCalls, setFunctionCalls] = useState<FunctionCall[]>([]);

  const {
    data: transfers,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', wallet.account?.name],
    enabled: !!wallet.account?.name,
    queryFn: async () => {
      /* --- Start Demo purposes --- */
      const functionName = 'walletSdk.getTransfers';
      const functionArgs = {
        accountName: wallet.account?.name ?? '',
        networkId: wallet.selectedNetwork,
        fungible: wallet.selectedFungible,
      };

      setFunctionCalls((prevCalls) => {
        const exists = prevCalls.some(
          (call) =>
            call.functionName === functionName &&
            JSON.stringify(call.functionArgs) === JSON.stringify(functionArgs),
        );
        if (exists) {
          return prevCalls;
        } else {
          return [...prevCalls, { functionName, functionArgs }];
        }
      });
      /* -- End demo ---------------*/

      return walletSdk.getTransfers(
        functionArgs.accountName,
        functionArgs.networkId,
        functionArgs.fungible,
      );
    },
  });

  useEffect(() => {
    if (!transfers || transfers.length === 0) return;
    const controller = new AbortController();

    const incompleteTransfers = transfers.filter(
      (transfer) => transfer.isCrossChainTransfer && !transfer.continuation,
    );

    /* --- Start Demo purposes --- */
    const functionName = 'walletSdk.subscribeOnCrossChainComplete';
    const functionArgs = {
      transfers: incompleteTransfers,
      callback: '() => refetch()',
      options: { signal: controller.signal },
    };

    setFunctionCalls((prevCalls) => {
      const exists = prevCalls.some(
        (call) =>
          call.functionName === functionName &&
          JSON.stringify(call.functionArgs) === JSON.stringify(functionArgs),
      );
      if (exists) {
        return prevCalls;
      } else {
        return [...prevCalls, { functionName, functionArgs }];
      }
    });
    /* -- End demo ---------------*/

    walletSdk.subscribeOnCrossChainComplete(
      incompleteTransfers,
      () => refetch(),
      {
        signal: controller.signal,
      },
    );
    return () => controller.abort();
  }, [refetch, transfers]);

  useEffect(() => {
    if (!pendingTransfers || pendingTransfers.length === 0) return;
    const controller = new AbortController();

    /* --- Start Demo purposes --- */
    const functionName = 'walletSdk.subscribePendingTransactions';
    const functionArgs = {
      pendingTransfers,
      callback: '(transfer) => { ... }',
      options: { signal: controller.signal },
    };

    setFunctionCalls((prevCalls) => {
      const exists = prevCalls.some(
        (call) =>
          call.functionName === functionName &&
          JSON.stringify(call.functionArgs) === JSON.stringify(functionArgs),
      );
      if (exists) {
        return prevCalls;
      } else {
        return [...prevCalls, { functionName, functionArgs }];
      }
    });
    /* -- End demo ---------------*/

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
  }, [pendingTransfers, refetch, removePendingTransfer]);

  return {
    transfers: transfers ?? [],
    error,
    pendingTransfers,
    account: wallet.account?.name,
    refetch,
    functionCalls, // demo
  };
};
