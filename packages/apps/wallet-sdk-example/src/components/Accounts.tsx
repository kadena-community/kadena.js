import { useState } from 'react';
import { useAccountsBalances } from '../hooks/balances';
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

  const [refreshKey, setRefreshKey] = useState(0);
  const handleRegistered = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">
        Accounts
      </h3>

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
