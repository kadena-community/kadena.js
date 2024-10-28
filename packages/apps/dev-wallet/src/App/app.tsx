import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { WalletConnectProvider } from '@/modules/walletconnect/walletconnect.provider';
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
      <DatabaseProvider>
        <PromptProvider>
          <WalletProvider>
            <WalletConnectProvider>
              <MediaContextProvider>{children}</MediaContextProvider>
            </WalletConnectProvider>
          </WalletProvider>
        </PromptProvider>
      </DatabaseProvider>
    </SessionProvider>
  );
}

export const App = () => (
  <Providers>
    <BetaHeader />
    <Routes />
  </Providers>
);
