'use client';
import { useWalletConnect } from '@/hooks/connect.hook';
import type { BalanceItem } from '@/services/chainweb/chainweb';
import { getBalance } from '@/services/chainweb/chainweb';
import type { KadenaAccount } from '@/services/connect/connect.client';
import { Select } from '@kadena/react-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { container } from './Accounts.css';

const KadenaAccountBalance: FC<{
  account: KadenaAccount;
  network: string;
  chain: string;
}> = ({ account, network, chain }) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    console.log(`fetch balance ${account.name}, ${network}, ${chain}`);
    getBalance(account.name, network, chain as BalanceItem['chain'])
      .then((balance) => {
        setBalance(balance.balance);
      })
      .catch((e) => {});
  }, [account.name, chain, network]);

  return <span>{balance ?? 'loading...'}</span>;
};

const KadenaAccounts: FC<{
  selected: string | null;
  accounts: Record<string, KadenaAccount[] | undefined>;
}> = ({ selected, accounts }) => {
  if (!selected) {
    return <span>No accounts selected</span>;
  }
  // console.log('test', accounts, selected);
  if (!accounts[selected]) {
    return <span>Loading accounts...</span>;
  }

  const network = 'testnet04';

  return (
    <div className={container}>
      <table>
        <thead>
          <tr>
            <td>account</td>
            <td>balance</td>
          </tr>
        </thead>
        <tbody>
          {accounts[selected]?.map((account) => (
            <tr key={account.name}>
              <td>{account.name}</td>
              {account.chains.map((chain) => (
                <td key={`account-${account.name}-${chain}`}>
                  <KadenaAccountBalance
                    account={account}
                    network={network}
                    chain={chain}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Accounts: FC = () => {
  const {
    sessionTopic,
    accounts,
    kadenaAccounts,
    fetchKadenaAccounts,
    setNetwork,
    networks,
    network,
  } = useWalletConnect();

  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const hasSession = !!sessionTopic;

  // Select first network and account on load
  useEffect(() => {
    if (!selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [selectedAccount, accounts]);

  useEffect(() => {
    if (network && selectedAccount) {
      fetchKadenaAccounts(selectedAccount).catch((e) => {});
    }
  }, [fetchKadenaAccounts, network, selectedAccount]);

  return (
    <div>
      <h3>Select account</h3>
      {!hasSession ? (
        'Not connected to wallet'
      ) : (
        <div style={{ display: 'flex' }}>
          <Select
            id="network"
            ariaLabel="network"
            value={network ?? ''}
            onChange={(e) => setNetwork(e.target.value)}
          >
            {networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </Select>
          <Select
            id="account"
            ariaLabel="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className={container}>
        <h3>Selected accounts</h3>
        <KadenaAccounts selected={selectedAccount} accounts={kadenaAccounts} />
      </div>
    </div>
  );
};
