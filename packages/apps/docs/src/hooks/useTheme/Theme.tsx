import { ThemeContext } from './ThemeProvider';
import { ThemeScript } from './ThemeScript';
import type { IThemeProviderProps } from './types';
import {
  colorSchemes,
  disableAnimation,
  getSystemTheme,
  getTheme,
  MEDIA,
} from './utils';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

const defaultThemes = ['light', 'dark'];

export const Theme: React.FC<IThemeProviderProps> = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = defaultThemes,
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  value,
  children,
  nonce,
}) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getTheme(storageKey),
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme: string | undefined) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === 'system' && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;

      if (attribute === 'class') {
        const classes = attrs.join(' ').split(' ').flat();
        d.classList.remove(...classes);

        const names = name.split(' ');
        if (names) {
          names.forEach((name: string) => {
            d.classList.add(name);
          });
        }
      } else {
        if (name) {
          d.setAttribute(attribute, name);
        } else {
          d.removeAttribute(attribute);
        }
      }

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : null;
        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;
        // @ts-ignore
        d.style.colorScheme = colorScheme;
      }

      enable?.();
    },
    [
      attribute,
      attrs,
      defaultTheme,
      disableTransitionOnChange,
      enableSystem,
      value,
      enableColorScheme,
    ],
  );

  const setTheme = useCallback(
    (theme: string) => {
      setThemeState(theme);

      // Save to storage
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {
        // Unsupported
      }
    },
    [storageKey],
  );

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === 'system' && enableSystem && !forcedTheme) {
        applyTheme('system');
      }
    },
    [theme, forcedTheme, applyTheme, enableSystem],
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent): void => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme, defaultTheme, storageKey]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme, applyTheme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === 'system' ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | 'light'
        | 'dark'
        | undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        {...{
          forcedTheme,
          disableTransitionOnChange,
          enableSystem,
          enableColorScheme,
          storageKey,
          themes,
          defaultTheme,
          attribute,
          value,
          children,
          attrs,
          nonce,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};
