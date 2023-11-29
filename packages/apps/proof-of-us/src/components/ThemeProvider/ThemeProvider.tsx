'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {}

export const ThemeProvider: FC<IProps> = ({ children }) => {
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
      value={{
        light: 'light',
        dark: 'dark',
      }}
    >
      {children}
    </NextThemeProvider>
  );
};
