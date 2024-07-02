import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { MonoContrast } from '@kadena/react-icons';
import { NavHeaderButton, Themes, useTheme } from '@kadena/kode-ui';
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
  }, [theme, rotateIcon]);

  const toggleTheme = useCallback((): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;

    setTheme(newTheme);
    analyticsEvent(EVENT_NAMES['click:change_theme'], {
      theme: newTheme,
    });
  }, [setTheme, theme]);

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
