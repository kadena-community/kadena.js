import { darkThemeClass } from '@kadena/react-ui/styles';
import { useCallback, useEffect, useState } from 'react';
const MEDIA = '(prefers-color-scheme: dark)';
const storageKey = 'theme';
const isServer = typeof window === 'undefined';
const defaultTheme = 'system';

export type ITheme = 'dark' | 'light' | 'system';
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
  setTheme: (value: ITheme) => void;
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

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent): ITheme => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};

export const useTheme = ({
  overwriteTheme,
  lockedTheme,
}: IUseThemeProps = {}): IUseThemeReturnProps => {
  const [theme, setThemeState] = useState(() =>
    lockedTheme ? lockedTheme : getTheme(storageKey),
  );

  const applyTheme = useCallback((theme: ITheme) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === 'system') {
      resolved = getSystemTheme();
    }
    if (lockedTheme) {
      resolved = lockedTheme;
    }

    const name = resolved;
    const d = document.documentElement;

    d.classList.remove('light');
    d.classList.remove(darkThemeClass);
    d.classList.add(name === 'dark' ? darkThemeClass : 'light');
  }, []);

  const setTheme = (value: ITheme): void => {
    const resolved = lockedTheme ? lockedTheme : value;
    setThemeState(resolved);
    applyTheme(resolved);

    window.localStorage.setItem(storageKey, resolved);
    window.dispatchEvent(new Event(storageKey));
  };

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = lockedTheme ? lockedTheme : getSystemTheme(e);
      setTheme(resolved);
    },
    [],
  );

  // Always listen to System preference
  useEffect(() => {
    if (lockedTheme) {
      setTheme(lockedTheme);
      return;
    }

    const media = window.matchMedia(MEDIA);
    const theme = window.localStorage.getItem(storageKey) as ITheme;
    if (theme) {
      setTheme(theme);
    } else {
      handleMediaQuery(media);
    }

    media.addEventListener('change', handleMediaQuery);

    return () => media.removeEventListener('change', handleMediaQuery);
  }, []);

  const storageListener = useCallback(
    (event: StorageEvent | Event) => {
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
      setThemeState(theme);
      applyTheme(theme);
    },
    [setThemeState],
  );

  useEffect(() => {
    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, [storageListener]);

  return {
    theme: overwriteTheme ? overwriteTheme : theme,
    setTheme,
  };
};
