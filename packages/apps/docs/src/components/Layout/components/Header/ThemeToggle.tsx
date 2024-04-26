import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { MonoContrast } from '@kadena/react-icons';
import { NavHeaderButton } from '@kadena/react-ui';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { baseIcon, reversedIcon } from './styles.css';

export const ThemeToggle: FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isRotated, rotateIcon] = useState<boolean>(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log(isRotated);

    rotateIcon(!isRotated);
    setTheme(newTheme);
    analyticsEvent(EVENT_NAMES['click:change_theme'], {
      theme: newTheme,
    });
  };

  if (!isMounted) return null;

  return (
    <NavHeaderButton
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
