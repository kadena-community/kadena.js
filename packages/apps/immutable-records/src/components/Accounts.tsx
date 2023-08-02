'use client';

import { useWalletConnect } from '@/connect/connect.hook';

import { FC } from 'react';

export const Accounts: FC = () => {
  const { sessionTopic, accounts } = useWalletConnect();
  const hasSession = !!sessionTopic;

  return (
    <div>
      <div>Accounts</div>
      {!hasSession ? (
        'Not connected'
      ) : (
        <table>
          <thead>
            <tr>
              <td>Account</td>
              <td>Balance</td>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((account) => (
              <tr key={account}>
                <td>{account}</td>
                <td>0</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
