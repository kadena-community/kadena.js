import { Transfer, walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const accountName = 'k:acct';
  const [pendingTransfers] = useState<Transfer[]>([]);
  const { data: transfers, refetch } = useQuery({
    queryKey: ['transfers', accountName],
    queryFn: () => walletSdk.getTransfers(accountName, 'coin', 'mainnet01'),
  });

  useEffect(() => {
    if (!transfers) return;
    const controller = new AbortController();
    walletSdk.subscribeOnCrossChainComplete(
      transfers.map((t) => ({ ...t, networkId: 'testnet04' })),
      () => refetch(),
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [transfers]);

  useEffect(() => {
    const controller = new AbortController();
    walletSdk.subscribePendingTransactions(
      pendingTransfers.map((t) => ({ ...t, networkId: 'testnet04' })),
      () => refetch(),
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [pendingTransfers]);

  return (
    <>
      <div>Hello</div>
    </>
  );
}

export default App;
