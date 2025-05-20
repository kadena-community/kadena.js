import { AssetProvider } from '@/components/AssetProvider/AssetProvider';
import { NetworkProvider } from '@/providers/NetworkProvider/NetworkProvider';
import { OrganisationProvider } from '@/providers/OrganisationProvider/OrganisationProvider';
import { TransactionsProvider } from '@/providers/TransactionsProvider/TransactionsProvider';
import { UserProvider } from '@/providers/UserProvider/UserProvider';
import { WalletProvider } from '@/providers/WalletProvider/WalletProvider';
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
            <OrganisationProvider>
              <UserProvider>
                <WalletProvider>
                  <AssetProvider>
                    <TransactionsProvider>{children}</TransactionsProvider>
                  </AssetProvider>
                </WalletProvider>
              </UserProvider>
            </OrganisationProvider>
          </SideBarLayoutProvider>
        </NetworkProvider>
      </ThemeProvider>
    </MediaContextProvider>
  );
};
