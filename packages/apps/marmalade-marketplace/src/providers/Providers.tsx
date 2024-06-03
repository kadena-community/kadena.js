'use client';
import type { FC, PropsWithChildren } from 'react';
import { AccountProvider } from './AccountProvider/AccountProvider';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AccountProvider>{children}</AccountProvider>
  );
};
