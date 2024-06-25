'use client';
import type { FC, PropsWithChildren } from 'react';
import { AccountProvider } from './AccountProvider/AccountProvider';
import { TransactionProvider }  from './TransactionProvider/TransactionProvider';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AccountProvider>
      <TransactionProvider>
        {children}
      </TransactionProvider>
    </AccountProvider>
  );
};
