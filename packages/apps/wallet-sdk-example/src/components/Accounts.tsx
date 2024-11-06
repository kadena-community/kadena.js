import { ChainId } from '@kadena/client';
import { useMemo } from 'react';
import { createAndTransferFund } from '../domain/fund';
import { useAccountsBalances } from '../hooks/balances';
import { useWalletState } from '../state/wallet';

export const Accounts = () => {
  const wallet = useWalletState();

  const chainIds = useMemo(() => ['0'] as ChainId[], []);
  const { loading: loadingBalance, balances: accountsBalances } =
    useAccountsBalances(
      wallet.accounts,
      wallet.selectedNetwork,
      wallet.selectedFungible,
      chainIds,
    );

  const onFundAccount = async (index: number) => {
    const account = wallet.accounts.find((a) => a.index === index);
    if (!account) return;
    const result = await createAndTransferFund({
      account: {
        name: account.name,
        publicKeys: [account.publicKey],
        predicate: 'keys-all',
      },
      config: {
        amount: '10',
        contract: 'coin',
        chainId: '0',
        networkId: wallet.selectedNetwork,
      },
    });
    alert(`Fund transaction submitted: ${result.requestKey}`);
  };

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">
        Accounts
      </h3>

      <div className="space-y-4 mb-6">
        {wallet.accounts.map((account) => (
          <div
            key={`account-${account.index}`}
            className="bg-medium-slate p-4 rounded-lg shadow-sm flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-secondary">Index:</span>
              <span className="text-white">{account.index}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-secondary">
                Account:
              </span>
              <span className="text-white">{account.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-secondary">
                Balance:
              </span>
              <span className="text-white">
                {loadingBalance ? '...' : accountsBalances[account.name] ?? '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-secondary">Fund:</span>
              <button
                onClick={() => onFundAccount(account.index)}
                className="bg-primary-green text-white font-semibold py-1 px-3 rounded-md hover:bg-secondary-green transition"
              >
                Fund
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-secondary">Active:</span>
              {wallet.account?.index === account.index ? (
                <button
                  disabled
                  className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-md cursor-not-allowed"
                >
                  Selected
                </button>
              ) : (
                <button
                  onClick={() => wallet.selectAccount(account.index)}
                  className="bg-primary-green text-white font-semibold py-1 px-3 rounded-md hover:bg-secondary-green transition"
                >
                  Select
                </button>
              )}
            </div>
          </div>
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
