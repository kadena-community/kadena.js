'use client';

import { KadenaAccount } from '@/connect/connect.client';
import { useWalletConnect } from '@/connect/connect.hook';

import { FC, useEffect, useState } from 'react';
import { container } from './Accounts.css';
import { Button } from '@kadena/react-ui';
import { BalanceItem, getBalance } from '@/app/services/chainweb';

const KadenaAccountBalance: FC<{ account: KadenaAccount; network: string }> = ({
  account,
  network,
}) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      `fetch balance ${account.name}, ${network}, ${account.chains[0]}`,
    );
    getBalance(
      account.name,
      network,
      account.chains[0] as BalanceItem['chain'],
    ).then((balance) => {
      setBalance(balance.balance);
    });
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
  if (!accounts[selected]) {
    return <span>Loading accounts...</span>;
  }

  const [, network] = selected?.split(':') ?? [];

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
              <td>
                <KadenaAccountBalance account={account} network={network} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Accounts: FC = () => {
  const { sessionTopic, accounts, kadenaAccounts, getKadenaAccounts } =
    useWalletConnect();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const hasSession = !!sessionTopic;

  useEffect(() => {
    if (selectedAccount) {
      getKadenaAccounts(selectedAccount);
    }
  }, [selectedAccount]);

  console.log({ selectedAccount });

  return (
    <div>
      <div className={container}>
        <h3>Accounts</h3>
        {!hasSession ? (
          'Not connected'
        ) : (
          <table>
            <thead>
              <tr>
                <td>Account</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {accounts?.map((account) => (
                <tr key={account}>
                  <td>{account}</td>
                  <td>
                    <Button onClick={() => setSelectedAccount(account)}>
                      Load accounts
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={container}>
        <h3>Selected accounts</h3>
        <KadenaAccounts selected={selectedAccount} accounts={kadenaAccounts} />
      </div>
    </div>
  );
};
