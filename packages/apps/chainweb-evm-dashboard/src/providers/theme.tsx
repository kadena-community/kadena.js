import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { useTheme } from '../hooks/useTheme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useTheme();

  return (
    <NextThemeProvider
      attribute="class"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
      enableSystem={true}
      enableColorScheme={true}
    >
      {children}
    </NextThemeProvider>
  );
}
