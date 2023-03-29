import { colors } from './colors';
import { breakpoints, sizes } from './stitches.config';

export type IThemeColors = `$${keyof typeof colors}`;
export type IThemeSizes = `$${keyof typeof sizes}`;
export type IThemeBreakpointProps = keyof typeof breakpoints;
export type IStyleBreakpointProps = `@${keyof typeof breakpoints}`;
