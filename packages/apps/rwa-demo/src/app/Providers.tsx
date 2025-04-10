import { AccountProvider } from '@/components/AccountProvider/AccountProvider';
import { AssetProvider } from '@/components/AssetProvider/AssetProvider';
import { NetworkProvider } from '@/components/NetworkProvider/NetworkProvider';
import { TransactionsProvider } from '@/components/TransactionsProvider/TransactionsProvider';
import { MediaContextProvider } from '@kadena/kode-ui';
import { SideBarLayoutProvider } from '@kadena/kode-ui/patterns';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { ThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MediaContextProvider>
      <ThemeProvider
        attribute="class"
        value={{
          light: 'light',
          dark: darkThemeClass,
        }}
        enableSystem={true}
        enableColorScheme={true} // When enabled, we can't make the background of the embedded iframe transparent
      >
        <NetworkProvider>
          <SideBarLayoutProvider>
            <AccountProvider>
              <AssetProvider>
                <TransactionsProvider>{children}</TransactionsProvider>
              </AssetProvider>
            </AccountProvider>
          </SideBarLayoutProvider>
        </NetworkProvider>
      </ThemeProvider>
    </MediaContextProvider>
  );
};
