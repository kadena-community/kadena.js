import type { ITheme } from './constants';
import { MEDIA, Themes } from './constants';

export const getSystemTheme = (
  e?: MediaQueryList | MediaQueryListEvent,
): ITheme => {
  if (!e) e = window.matchMedia(MEDIA);

  const isDark = e.matches;
  const systemTheme = isDark ? Themes.dark : Themes.light;
  return systemTheme;
};
