import { AccountProvider } from '@/components/AccountProvider/AccountProvider';
import { AssetProvider } from '@/components/AssetProvider/AssetProvider';
import { NetworkProvider } from '@/components/NetworkProvider/NetworkProvider';
import { MediaContextProvider } from '@kadena/kode-ui';
import { LayoutProvider } from '@kadena/kode-ui/patterns';
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
          <AccountProvider>
            <LayoutProvider>
              <AssetProvider>{children}</AssetProvider>
            </LayoutProvider>
          </AccountProvider>
        </NetworkProvider>
      </ThemeProvider>
    </MediaContextProvider>
  );
};
