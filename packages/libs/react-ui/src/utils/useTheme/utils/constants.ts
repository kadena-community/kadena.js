export const MEDIA = '(prefers-color-scheme: dark)';
export const storageKey = 'theme';
export enum Themes {
  system = 'system',
  light = 'light',
  dark = 'dark',
}
export const isServer = typeof window === 'undefined';
export const defaultTheme = Themes.system;

export type ITheme = keyof typeof Themes;
