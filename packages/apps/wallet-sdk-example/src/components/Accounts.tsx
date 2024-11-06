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
    <div>
      <h3 className="text-2xl">Accounts:</h3>
      <table>
        <thead>
          <tr>
            <td>Index</td>
            <td>Account</td>
            <td>Balance</td>
            <td>Fund</td>
            <td>Active</td>
          </tr>
        </thead>
        <tbody>
          {wallet.accounts.map((account) => {
            return (
              <tr key={`account-${account.index}`}>
                <td>{account.index}</td>
                <td>{account.name}</td>
                <td>
                  {loadingBalance
                    ? '...'
                    : accountsBalances[account.name] ?? '0'}
                </td>
                <td>
                  <button onClick={() => onFundAccount(account.index)}>
                    Fund
                  </button>
                </td>
                <td>
                  {wallet.account?.index === account.index ? (
                    <button disabled>Selected</button>
                  ) : (
                    <button onClick={() => wallet.selectAccount(account.index)}>
                      Select
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={() => wallet.generateAccount()}>
        Generate new account
      </button>
    </div>
  );
};
