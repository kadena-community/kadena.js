import { Theme } from './Theme';
import { type IThemeProviderProps, type IUseThemeProps } from './types';

import React, { createContext, useContext } from 'react';

export const ThemeContext = createContext<IUseThemeProps | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<IThemeProviderProps> = (props) => {
  const context = useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return <>{props.children}</>;
  return <Theme {...props} />;
};
