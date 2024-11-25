import '@kadena/kode-ui/global';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import './global.css.ts';

import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { KadenaNames } from './components/kadenaNames/KadenaNamesResolver';
import MarkdownPage from './components/Root';
import { Transfer } from './components/Transfer';
import { Transfers } from './components/Transfers';
import { Wallet } from './components/Wallet';

const queryClient = new QueryClient();

function App() {
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
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route path="/" element={<MarkdownPage />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/list" element={<Transfers />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/kadenanames" element={<KadenaNames />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
