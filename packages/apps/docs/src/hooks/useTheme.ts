import { darkThemeClass } from '@kadena/react-ui/styles';
import { useCallback, useEffect, useState } from 'react';
const MEDIA = '(prefers-color-scheme: dark)';
const storageKey = 'theme';
const isServer = typeof window === 'undefined';
const defaultTheme = 'system';

type ITheme = 'dark' | 'light' | 'system';
interface IUseThemeProps {
  overwriteTheme?: ITheme;
}
interface IUseThemeReturnProps {
  theme: ITheme;
  setTheme: (value: ITheme) => void;
}

const getTheme = (key: string) => {
  if (isServer) return undefined;
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return theme || defaultTheme;
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};

export const useTheme = ({
  overwriteTheme,
}: IUseThemeProps = {}): IUseThemeReturnProps => {
  const [theme, setThemeState] = useState(() => getTheme(storageKey));

  const applyTheme = useCallback((theme: ITheme) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === 'system') {
      resolved = getSystemTheme();
    }

    const name = resolved;

    const d = document.documentElement;

    d.classList.remove('light');
    d.classList.remove(darkThemeClass);
    d.classList.add(name === 'dark' ? darkThemeClass : 'light');
  }, []);

  const setTheme = (value: ITheme): void => {
    setThemeState(value);
    applyTheme(value);

    window.localStorage.setItem(storageKey, value);
    window.dispatchEvent(new Event(storageKey));
  };

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setTheme(resolved);
    },
    [setTheme],
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);
    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addEventListener('change', handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeEventListener('change', handleMediaQuery);
  }, []);

  const storageListener = useCallback(
    (event: Event) => {
      if (event.type !== storageKey) return;

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = window.localStorage.getItem(storageKey) || defaultTheme;
      setThemeState(theme);
    },
    [setThemeState],
  );

  useEffect(() => {
    window.addEventListener(storageKey, storageListener);
    return () => window.removeEventListener(storageKey, storageListener);
  }, [setThemeState, theme, storageListener]);

  return {
    theme: overwriteTheme ? overwriteTheme : theme,
    setTheme,
  };
};
