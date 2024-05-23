import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { Routes } from './routes';

function Providers({ children }: { children: React.ReactNode }) {
  return (
      <DatabaseProvider>
        <WalletProvider>{children}</WalletProvider>
      </DatabaseProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
