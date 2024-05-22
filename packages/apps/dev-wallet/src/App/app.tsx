import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { darkThemeClass } from '@kadena/react-ui/styles';
import { ThemeProvider } from 'next-themes';
import { Routes } from './routes';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="dark"
      value={{
        light: 'light',
        dark: darkThemeClass,
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
