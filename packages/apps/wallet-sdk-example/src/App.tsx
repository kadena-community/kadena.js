import { walletSdk } from '@kadena/wallet-sdk';
import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  const transferToDescriptor = (
    t: Transfer,
    networkId: string,
  ): ITransactionDescriptor => ({
    requestKey: t.requestKey,
    chainId: t.chainId,
    networkId,
  });

  const accountName = 'k:acct';
  const [pendingTransfers] = useState<Transfer[]>([]);
  const { data: transfers, refetch } = useQuery<Transfer[]>(() =>
    walletSdk.getTransfers(accountName, 'coin', 'mainnet01'),
  );
  useEffect(() => {
    const controller = new AbortController();
    walletSdk.subscribeOnCrossChainComplete(
      transfers.map((t) => transferToDescriptor(t, 'testnet04')),
      () => refetch(),
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [transfers]);

  useEffect(() => {
    const controller = new AbortController();
    walletSdk.subscribePendingTransactions(
      pendingTransfers.map((t) => transferToDescriptor(t, 'testnet04')),
      () => refetch(),
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [pendingTransfers]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
