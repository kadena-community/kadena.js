import { DatabaseProvider } from '@/modules/db/db.provider';
import { LayoutProvider } from '@/modules/layout/layout.provider.tsx';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { useTheme } from '@kadena/react-ui';
import { Routes } from './routes';

function Providers({ children }: { children: React.ReactNode }) {
  // initialize the theme
  useTheme();
  return (
    <DatabaseProvider>
      <WalletProvider>
        <LayoutProvider>{children}</LayoutProvider>
      </WalletProvider>
    </DatabaseProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
