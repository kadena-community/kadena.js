import { InDevelopmentProvider } from '@/Components/InDevelopmentProvider/InDevelopmentProvider';
import { MaintenanceProvider } from '@/Components/MaintenanceProvider/MaintenanceProvider';
import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { MediaContextProvider, useTheme } from '@kadena/kode-ui';
import { SideBarLayoutProvider } from '@kadena/kode-ui/patterns';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { PromptProvider } from '../Components/PromptProvider/Prompt';
import { GlobalStateProvider } from './providers/globalState';
import { SessionProvider } from './providers/session';
import { Routes } from './routes';

import { PluginProvider } from '@/modules/plugins/plugin.provider';
import '../modules/plugins/PluginManager';

function Providers({ children }: { children: React.ReactNode }) {
  useTheme();
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);
  return (
    <PluginProvider>
      <AnimatePresence mode="sync">
        <GlobalStateProvider>
          <MediaContextProvider>
            <SideBarLayoutProvider>
              <SessionProvider>
                <PromptProvider>
                  <DatabaseProvider>
                    <MaintenanceProvider>
                      <InDevelopmentProvider>
                        <WalletProvider>
                          {/* TODO: fixed the issue with prompt and remove this one in favor of the one above */}
                          <PromptProvider>{children}</PromptProvider>
                        </WalletProvider>
                      </InDevelopmentProvider>
                    </MaintenanceProvider>
                  </DatabaseProvider>
                </PromptProvider>
              </SessionProvider>
            </SideBarLayoutProvider>
          </MediaContextProvider>
        </GlobalStateProvider>
      </AnimatePresence>
    </PluginProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
