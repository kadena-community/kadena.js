'use client';

import { darkThemeClass } from '@kadena/kode-ui/styles';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { FC, PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {}

export const ThemeProvider: FC<IProps> = ({ children }) => {
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem={false}
      value={{
        dark: darkThemeClass,
      }}
      defaultTheme="dark"
    >
      {children}
    </NextThemeProvider>
  );
};
