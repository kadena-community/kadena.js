import { DatabaseProvider } from '@/modules/db/db.provider';
import { ThemeProvider } from 'next-themes';
import { WalletProvider } from '../modules/wallet/wallet.provider';
import { Routes } from './routes';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
      value={{
        light: 'light',
      }}
    >
      <DatabaseProvider>
        <WalletProvider>{children}</WalletProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
