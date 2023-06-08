/* eslint @typescript-eslint/naming-convention: 0, @kadena-dev/typedef-var: 0 */

import { darkThemeClass, vars } from './themes.css';

import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';

export const breakpoints = {
  sm: `(min-width: ${640 / 16}rem)`,
  md: `(min-width: ${768 / 16}rem)`,
  lg: `(min-width: ${1024 / 16}rem)`,
  xl: `(min-width: ${1280 / 16}rem)`,
  '2xl': `(min-width: ${1536 / 16}rem)`,
} as const;

const systemProperties = defineProperties({
  properties: {
    fontFamily: vars.fonts,
    fontSize: vars.fontSizes,
    fontWeight: vars.fontWeights,
    borderRadius: vars.radii,
    boxShadow: vars.shadows,
    borderWidth: vars.borderWidths,
    borderStyles: ['solid'],
    cursor: ['pointer', 'not-allowed'],
    flexWrap: ['wrap', 'nowrap'],
    top: [0],
    bottom: [0],
    left: [0],
    right: [0],
    flexShrink: [0],
    flexGrow: [0, 1],
    zIndex: [-1, 0, 1],
    border: ['none'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { selector: `.${darkThemeClass} &` },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: vars.colors,
    background: vars.colors,
    backgroundColor: vars.colors,
  },
  shorthands: {
    bg: ['background', 'backgroundColor'],
  },
});

const responsiveProperties = defineProperties({
  conditions: {
    xs: {},
    sm: { '@media': breakpoints.sm },
    md: { '@media': breakpoints.md },
    lg: { '@media': breakpoints.lg },
    xl: { '@media': breakpoints.xl },
    '2xl': { '@media': breakpoints['2xl'] },
  },
  defaultCondition: 'xs',
  properties: {
    display: ['none', 'flex', 'block', 'inline', 'inline-block', 'grid'],
    flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
    justifyContent: [
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch'],
    paddingTop: vars.sizes,
    paddingBottom: vars.sizes,
    paddingLeft: vars.sizes,
    paddingRight: vars.sizes,
    marginTop: vars.sizes,
    marginBottom: vars.sizes,
    marginLeft: vars.sizes,
    marginRight: vars.sizes,
    width: { ...vars.sizes, '100%': '100%' },
    height: vars.sizes,
    gap: vars.sizes,
    overflow: ['hidden'],
    pointerEvents: ['none', 'auto'],
    opacity: [0, 1],
    textAlign: ['left', 'center', 'right'],
    minWidth: [0],
  },
  shorthands: {
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems'],
    size: ['width', 'height'],
  },
});

export const sprinkles = createSprinkles(
  systemProperties,
  colorProperties,
  responsiveProperties,
);

export type Sprinkles = Parameters<typeof sprinkles>[0];
