import { MonoContrast } from '@kadena/react-icons';
import { Button, Themes, useTheme } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { buttonSizeClass } from '../navbar/styles.css';
import { baseIcon, reversedIcon } from './styles.css';

const ThemeToggle: FC = () => {
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
  }, [setTheme, theme]);

  if (!isMounted) return null;

  return (
    <Button
      className={buttonSizeClass}
      variant="transparent"
      onPress={toggleTheme}
      title="Toggle between Light and Dark theme"
      aria-label="Toggle between Light and Dark theme"
      startVisual={
        <MonoContrast
          className={classNames(baseIcon, {
            [reversedIcon]: isRotated,
          })}
        />
      }
    />
  );
};

export default ThemeToggle;
