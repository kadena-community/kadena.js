'use client';
import type { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { AccountProvider } from './AccountProvider/AccountProvider';
import { TransactionProvider }  from './TransactionProvider/TransactionProvider';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AccountProvider>
      <TransactionProvider>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
          value={{
            light: 'light',
            dark: darkThemeClass,
          }}>
          {children}
        </ThemeProvider>
      </TransactionProvider>
    </AccountProvider>
  );
};
