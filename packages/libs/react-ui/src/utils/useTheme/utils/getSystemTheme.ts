import { MEDIA } from './constants';

export const getSystemTheme = (
  e?: MediaQueryList | MediaQueryListEvent,
): ITheme => {
  if (!e) e = window.matchMedia(MEDIA);

  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};
