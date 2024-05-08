import { darkThemeClass } from '@kadena/react-ui/styles';
import { ThemeProvider } from 'next-themes';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { DatabaseProvider } from '@/modules/db/db.provider';
import { Routes } from './routes';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
      defaultTheme="dark"
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
