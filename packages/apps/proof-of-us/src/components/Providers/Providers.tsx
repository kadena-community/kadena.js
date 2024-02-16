'use client';
import { localStorageProvider } from '@/utils/localStorageProvider';
import { ThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AccountProvider } from '../AccountProvider/AccountProvider';
import { ToastProvider } from '../ToastProvider/ToastProvider';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <ToastProvider>
        <AccountProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AccountProvider>
      </ToastProvider>
    </SWRConfig>
  );
};
