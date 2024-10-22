import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { MediaContextProvider } from '@kadena/kode-ui';
import { useEffect } from 'react';
import { PromptProvider } from '../Components/PromptProvider/Prompt';
import { BetaHeader } from './BetaHeader';
import { Routes } from './routes';
import { SessionProvider } from './session';

function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);
  return (
    <SessionProvider>
      <PromptProvider>
        <DatabaseProvider>
          <WalletProvider>
            <PromptProvider>
              <MediaContextProvider>{children}</MediaContextProvider>
            </PromptProvider>
          </WalletProvider>
        </DatabaseProvider>
      </PromptProvider>
    </SessionProvider>
  );
}

export const App = () => (
  <Providers>
    <BetaHeader />
    <Routes />
  </Providers>
);
