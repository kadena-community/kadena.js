import { useTheme } from '@/hooks/useTheme';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { MonoContrast } from '@kadena/react-icons';
import { NavHeaderButton } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { baseIcon, reversedIcon, socialsClass } from './styles.css';

export const ThemeToggle: FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isRotated, rotateIcon] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    rotateIcon(!isRotated);
  }, [theme]);

  const toggleTheme = useCallback((): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
    analyticsEvent(EVENT_NAMES['click:change_theme'], {
      theme: newTheme,
    });
  }, [setTheme]);

  if (!isMounted) return null;

  return (
    <NavHeaderButton
      className={socialsClass}
      onPress={toggleTheme}
      title="Toggle between Light and Dark theme"
      aria-label="Toggle between Light and Dark theme"
    >
      <MonoContrast
        className={classNames(baseIcon, {
          [reversedIcon]: isRotated,
        })}
      />
    </NavHeaderButton>
  );
};
