import { DatabaseProvider } from '@/modules/db/db.provider';
import { WalletProvider } from '@/modules/wallet/wallet.provider';
import { Button } from '@kadena/react-ui';
import { darkThemeClass } from '@kadena/react-ui/styles';
import { ThemeProvider, useTheme } from 'next-themes';
import { Routes } from './routes';

// on click set to 'light'
function Providers({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

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
      <Button onPress={() => setTheme('dark')}>Toggle</Button>
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
