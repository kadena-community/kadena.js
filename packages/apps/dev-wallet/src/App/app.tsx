import { DatabaseProvider } from '@/modules/db/db.provider';
import { LayoutProvider } from '@/modules/layout/layout.provider.tsx';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { useTheme } from '@kadena/kode-ui';
import { PromptProvider } from '../Components/PromptProvider/Prompt';
import { Routes } from './routes';
import { SessionProvider } from './session';

function Providers({ children }: { children: React.ReactNode }) {
  // initialize the theme
  useTheme();
  return (
    <SessionProvider>
      <DatabaseProvider>
        <PromptProvider>
          <WalletProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </WalletProvider>
        </PromptProvider>
      </DatabaseProvider>
    </SessionProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
