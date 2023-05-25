import { IconButton, SystemIcons } from '@kadena/react-components';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useTheme } from 'next-themes';
import React, { FC, useEffect, useState } from 'react';

export const ThemeToggle: FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    analyticsEvent(EVENT_NAMES['click:change_theme'], {
      label: `toggle theme to ${newTheme}`,
    });
  };

  if (!isMounted) return null;

  return (
    <IconButton
      title="Toggle theme"
      onClick={toggleTheme}
      icon={SystemIcons.ThemeLightDark}
      color="inverted"
    />
  );
};
