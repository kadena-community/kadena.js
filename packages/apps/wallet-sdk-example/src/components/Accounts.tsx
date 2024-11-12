import { useState } from 'react';
import { useAccountsBalances } from '../hooks/balances';
import { useChains } from '../hooks/chains';
import { useWalletState } from '../state/wallet';
import { AccountItem } from './AccountItem';

export const Accounts = () => {
  const wallet = useWalletState();

  const { loading: loadingBalance, balances: accountsBalances } =
    useAccountsBalances(
      wallet.accounts,
      wallet.selectedNetwork,
      wallet.selectedFungible,
      wallet.selectedChain,
    );

  const { chains } = useChains(wallet.selectedNetwork);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRegistered = () => setRefreshKey((prev) => prev + 1);

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = event.target.value as typeof wallet.selectedChain;
    wallet.selectChain(selectedChain);
  };

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">
        Accounts
      </h3>

      <div className="mb-6">
        <label htmlFor="chain-selector" className="text-white mr-2">
          Select Chain:
        </label>

        <select
          id="chain-selector"
          value={wallet.selectedChain}
          onChange={handleChainChange}
          className="p-2 rounded-md bg-dark-slate text-white"
        >
          {chains.map((chain) => (
            <option key={chain} value={chain}>
              Chain {chain}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 mb-6">
        {wallet.accounts.map((account) => (
          <AccountItem
            key={`account-${account.index}`}
            account={account}
            accountsBalances={accountsBalances}
            loadingBalance={loadingBalance}
            onRegistered={handleRegistered}
            refreshKey={refreshKey}
          />
        ))}
      </div>

      <button
        onClick={() => wallet.generateAccount()}
        className="w-full bg-primary-green text-white font-semibold py-2 px-4 rounded-md hover:bg-secondary-green transition"
      >
        Generate New Account
      </button>
    </div>
  );
};
