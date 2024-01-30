import { ThemeProvider } from 'next-themes';
import { WalletContextProvider } from '../wallet/wallet.context';
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
      <WalletContextProvider>{children}</WalletContextProvider>
    </ThemeProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
