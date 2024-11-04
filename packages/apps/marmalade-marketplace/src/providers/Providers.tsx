'use client';
import { MediaContextProvider } from '@kadena/kode-ui';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { ThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';
import { AccountProvider } from './AccountProvider/AccountProvider';
import { TransactionProvider } from './TransactionProvider/TransactionProvider';

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
          }}
        >
          <MediaContextProvider>{children}</MediaContextProvider>
        </ThemeProvider>
      </TransactionProvider>
    </AccountProvider>
  );
};
