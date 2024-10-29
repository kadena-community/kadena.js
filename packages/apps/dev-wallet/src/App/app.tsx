import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { MediaContextProvider } from '@kadena/kode-ui';
import { SideBarProvider } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';
import { PromptProvider } from '../Components/PromptProvider/Prompt';
import { Routes } from './routes';
import { SessionProvider } from './session';

function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);
  return (
    <MediaContextProvider>
      <SessionProvider>
        <PromptProvider>
          <DatabaseProvider>
            <WalletProvider>
              <SideBarProvider>
                {/* TODO: fixed the issue with prompt and remove this one in favor of the one above */}
                <PromptProvider>{children}</PromptProvider>
              </SideBarProvider>
            </WalletProvider>
          </DatabaseProvider>
        </PromptProvider>
      </SessionProvider>
    </MediaContextProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
