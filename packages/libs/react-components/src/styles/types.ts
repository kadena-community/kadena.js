import { media, theme } from './stitches.config';

export type IThemeColors = `$${keyof typeof theme.colors}`;
export type IThemeSizes = `$${keyof typeof theme.sizes}`;
export type IThemeBreakpointProps = keyof typeof media;
export type IStyleBreakpointProps = `@${keyof typeof media}`;
