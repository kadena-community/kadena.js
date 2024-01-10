import { CryptoContextProvider } from '@/hooks/crypto.context';
import { ThemeProvider } from 'next-themes';

import { RemoteConnectionContext } from '@/hooks/remote.context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CryptoContextProvider>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="dark"
        value={{
          light: 'light',
        }}
      >
        <RemoteConnectionContext>{children}</RemoteConnectionContext>
      </ThemeProvider>
    </CryptoContextProvider>
  );
}
