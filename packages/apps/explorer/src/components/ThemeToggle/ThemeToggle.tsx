import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { Button, ThemeAnimateIcon, useTheme } from '@kadena/kode-ui';

import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { buttonSizeClass } from '../Navbar/styles.css';

export const ThemeToggle: FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, rotateTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = useCallback((): void => {
    analyticsEvent(EVENT_NAMES['click:switch_theme'], {
      theme,
    });

    rotateTheme();
  }, [rotateTheme, theme]);

  if (!isMounted) return null;

  return (
    <Button
      className={buttonSizeClass}
      variant="transparent"
      onPress={toggleTheme}
      title="Toggle between Light and Dark theme"
      aria-label="Toggle between Light and Dark theme"
      startVisual={<ThemeAnimateIcon theme={theme} />}
    />
  );
};
