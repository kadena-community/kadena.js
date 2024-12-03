import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { MediaContextProvider, useTheme } from '@kadena/kode-ui';
import { LayoutProvider } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';
import { PromptProvider } from '../Components/PromptProvider/Prompt';
import { NavigationContext } from './NavigationContext';
import { Routes } from './routes';
import { SessionProvider } from './session';

function Providers({ children }: { children: React.ReactNode }) {
  useTheme();
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);
  return (
    <NavigationContext>
      <MediaContextProvider>
        <LayoutProvider>
          <SessionProvider>
            <PromptProvider>
              <DatabaseProvider>
                <WalletProvider>
                  {/* TODO: fixed the issue with prompt and remove this one in favor of the one above */}
                  <PromptProvider>{children}</PromptProvider>
                </WalletProvider>
              </DatabaseProvider>
            </PromptProvider>
          </SessionProvider>
        </LayoutProvider>
      </MediaContextProvider>
    </NavigationContext>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
