'use client';
import { useCallback, useEffect, useState } from 'react';
import { darkThemeClass } from '../../styles';
import type { ITheme } from './utils/constants';
import {
  MEDIA,
  Themes,
  defaultTheme,
  isServer,
  storageKey,
} from './utils/constants';
import { getSystemTheme } from './utils/getSystemTheme';

interface IUseThemeProps {
  /**
   * lockedTheme will lock the theme for the whole application.
   * It will overwrite the localstorage and even the switching of themes in your system will not update the theme
   * IMPORTANT: using the useTheme twice in a application can lead to unexpected race conditions
   * You would need to lock the theme on all the uses of this hook with the same ITheme
   */
  lockedTheme?: ITheme;
  /**
   * overwriteTheme can be used when you want 1 particular component to have a fixed theme
   * IMPORTANT: this will also overwrite the lockedTheme for that component
   */
  overwriteTheme?: ITheme;
}
interface IUseThemeReturnProps {
  theme: ITheme | undefined;
  rotateThemeState: ITheme | undefined;
  setTheme: (value: ITheme) => void;
  rotateTheme: () => void;
}

const getTheme = (key: string) => {
  if (isServer) return undefined;
  let theme: ITheme | undefined = undefined;
  try {
    theme = (localStorage.getItem(key) as ITheme) || undefined;
  } catch (e) {
    console.error('localStorage is not suported in this browser');
  }
  return theme || defaultTheme;
};

export const useTheme = ({
  overwriteTheme,
  lockedTheme,
}: IUseThemeProps = {}): IUseThemeReturnProps => {
  const [rotateThemeState, setRotateThemeState] = useState<
    ITheme | undefined
  >();
  const [theme, setThemeState] = useState(() =>
    lockedTheme ? lockedTheme : getTheme(storageKey),
  );

  const applyTheme = useCallback((innerTheme: ITheme) => {
    let resolved = innerTheme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (innerTheme === 'system') {
      //resolved = 'system';
      resolved = getSystemTheme();
    }
    if (lockedTheme) {
      resolved = lockedTheme;
    }

    const name = resolved;
    const documentElement = document.documentElement;

    documentElement.classList.remove(Themes.light);
    documentElement.classList.remove(darkThemeClass);
    documentElement.classList.add(
      name === Themes.dark ? darkThemeClass : Themes.light,
    );
  }, []);

  const setTheme = (
    value: ITheme,
    updateLocalStorage: boolean = true,
  ): void => {
    const resolved = lockedTheme ? lockedTheme : value;

    setThemeState(resolved);
    applyTheme(resolved);

    if (updateLocalStorage) {
      window.localStorage.setItem(storageKey, resolved);
      window.dispatchEvent(new Event(storageKey));
    }
  };

  useEffect(() => {
    setRotateThemeState(theme);
  }, [theme]);

  // Always listen to System preference
  useEffect(() => {
    if (lockedTheme) {
      setTheme(lockedTheme);
      return;
    }
    const media = window.matchMedia(MEDIA);
    const theme = window.localStorage.getItem(storageKey) as ITheme;

    const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
      if (theme === 'system') {
        setTheme('system');
        return;
      }
      const resolved = lockedTheme ? lockedTheme : theme;
      setTheme(resolved ?? 'system');
    };

    if (theme) {
      setTheme(theme);
    } else {
      handleMediaQuery(media);
    }

    media.addEventListener('change', handleMediaQuery);

    return () => media.removeEventListener('change', handleMediaQuery);
  }, [rotateThemeState, theme, lockedTheme, setTheme]);

  useEffect(() => {
    const storageListener = (event: StorageEvent | Event) => {
      if (
        event.type !== storageKey &&
        'key' in event &&
        event.key !== storageKey
      )
        return;

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = lockedTheme
        ? lockedTheme
        : (window.localStorage.getItem(storageKey) as ITheme) || defaultTheme;
      setTheme(theme, false);
    };

    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  const rotateTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        return;
      case 'dark':
        setTheme('system');
        return;
      case 'system':
        setTheme('light');
        return;
      default:
        setTheme('system');
        return;
    }
  };

  return {
    rotateThemeState: overwriteTheme ? overwriteTheme : rotateThemeState,
    theme: overwriteTheme ? overwriteTheme : theme,
    setTheme,
    rotateTheme,
  };
};
