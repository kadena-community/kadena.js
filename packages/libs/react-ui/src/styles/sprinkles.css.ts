import { colorVars } from './colors/colorThemes.css';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  radii,
  shadows,
  sizes,
} from './tokens/index.css';

import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';

const systemProperties = defineProperties({
  properties: {
    fontFamily: fontFamilies,
    fontSize: fontSizes,
    fontWeight: fontWeights,
    borderRadius: radii,
    boxSahdow: shadows,
    cursor: ['pointer', 'not-allowed'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: colorVars.color,
    background: colorVars.color,
    backgroundColor: colorVars.color,
  },
  shorthands: {
    bg: ['background', 'backgroundColor'],
  },
});

const responsiveProperties = defineProperties({
  conditions: {
    xs: {},
    sm: { '@media': `(min-width: ${640 / 16}rem)` },
    md: { '@media': `(min-width: ${768 / 16}rem)` },
    lg: { '@media': `(min-width: ${1024 / 16}rem)` },
    xl: { '@media': `(min-width: ${1280 / 16}rem)` },
    '2xl': { '@media': `(min-width: ${1536 / 16}rem)` },
  },
  defaultCondition: 'xs',
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    paddingTop: sizes,
    paddingBottom: sizes,
    paddingLeft: sizes,
    paddingRight: sizes,
    width: sizes,
    height: sizes,
    gap: sizes,
  },
  shorthands: {
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
