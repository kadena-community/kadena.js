import { SystemIcon } from '@kadena/react-ui';

import { headerButtonClass, iconButtonClass } from './styles.css';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import classNames from 'classnames';
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
      theme: newTheme,
    });
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={toggleTheme}
      title="Go to our Twitter"
      className={classNames(headerButtonClass, iconButtonClass)}
    >
      <SystemIcon.ThemeLightDark />
    </button>
  );
};
