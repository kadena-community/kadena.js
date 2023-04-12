import { Icons } from '@kadena/react-components';

import { useTheme } from 'next-themes';
import React, { FC, useEffect, useState } from 'react';

export const ThemeToggle: FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!isMounted) return null;

  return (
    <button onClick={toggleTheme}>
      <Icons.ThemeLightDarkIcon />
    </button>
  );
};
