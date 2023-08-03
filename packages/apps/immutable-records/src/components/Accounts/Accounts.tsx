'use client';

import { KadenaAccount } from '@/connect/connect.client';
import { useWalletConnect } from '@/connect/connect.hook';

import { FC, useEffect, useState } from 'react';
import { container } from './Accounts.css';
import { Button } from '@kadena/react-ui';

const KadenaAccountBalance: FC<{ account: string }> = ({ account }) => {
  useEffect(() => {
    console.log(`fetch balance ${account}`);
  }, []);
  return 0;
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
                <KadenaAccountBalance account={account.name} />
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
