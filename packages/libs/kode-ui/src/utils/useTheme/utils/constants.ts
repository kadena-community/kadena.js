export const MEDIA = '(prefers-color-scheme: dark)';
export const storageKey = 'theme';
export const Themes = {
  system: 'system',
  light: 'light',
  dark: 'dark',
} as const;
export const isServer = typeof window === 'undefined';
export const defaultTheme = Themes.system;

export type ITheme = keyof typeof Themes;
