import '@kadena/kode-ui/global';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import './global.css.ts';

import { useRoutes } from 'react-router-dom';
import routes from './routes';

const queryClient = new QueryClient();

function App() {
  const routing = useRoutes(routes);

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
        <>
          <Header />
          {routing}
        </>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
