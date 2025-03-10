import { MaintenanceProvider } from '@/Components/MaintenanceProvider/MaintenanceProvider';
import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { MediaContextProvider, useTheme } from '@kadena/kode-ui';
import { SideBarLayoutProvider } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';
import { PromptProvider } from '../Components/PromptProvider/Prompt';
import { GlobalStateProvider } from './providers/globalState';
import { SessionProvider } from './providers/session';
import { Routes } from './routes';

function Providers({ children }: { children: React.ReactNode }) {
  useTheme();
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);
  return (
    <GlobalStateProvider>
      <MediaContextProvider>
        <SideBarLayoutProvider>
          <SessionProvider>
            <PromptProvider>
              <DatabaseProvider>
                <WalletProvider>
                  <MaintenanceProvider>
                    {/* TODO: fixed the issue with prompt and remove this one in favor of the one above */}
                    <PromptProvider>{children}</PromptProvider>
                  </MaintenanceProvider>
                </WalletProvider>
              </DatabaseProvider>
            </PromptProvider>
          </SessionProvider>
        </SideBarLayoutProvider>
      </MediaContextProvider>
    </GlobalStateProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
