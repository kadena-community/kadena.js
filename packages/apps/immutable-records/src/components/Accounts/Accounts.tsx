'use client';

import { KadenaAccount } from '@/connect/connect.client';
import { useWalletConnect } from '@/connect/connect.hook';

import { FC, useEffect, useState } from 'react';
import { container } from './Accounts.css';
import { Button, Select, Option } from '@kadena/react-ui';
import { BalanceItem, getBalance } from '@/app/services/chainweb';

const KadenaAccountBalance: FC<{
  account: KadenaAccount;
  network: string;
  chain: string;
}> = ({ account, network, chain }) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    console.log(`fetch balance ${account.name}, ${network}, ${chain}`);
    getBalance(account.name, network, chain as BalanceItem['chain']).then(
      (balance) => {
        setBalance(balance.balance);
      },
    );
  }, []);

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
      fetchKadenaAccounts(selectedAccount);
    }
  }, [network, selectedAccount]);

  return (
    <div>
      <h3>Select account</h3>
      {!hasSession ? (
        'Not connected to wallet'
      ) : (
        <div style={{ display: 'flex' }}>
          <Select
            ariaLabel="network"
            value={network ?? ''}
            onChange={(e) => setNetwork(e.target.value)}
          >
            {networks.map((network) => (
              <Option key={network} value={network}>
                {network}
              </Option>
            ))}
          </Select>
          <Select
            ariaLabel="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <Option key={account} value={account}>
                {account}
              </Option>
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
