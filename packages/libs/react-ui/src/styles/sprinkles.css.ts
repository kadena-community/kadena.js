import { breakpoints } from './themeUtils';
import { darkThemeClass, vars } from './vars.css';

import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import mapValues from 'lodash.mapvalues';

const systemProperties = defineProperties({
  properties: {
    fontFamily: vars.fonts,
    lineHeight: vars.lineHeights,
    borderRadius: vars.radii,
    boxShadow: vars.shadows,
    borderWidth: vars.borderWidths,
    borderStyle: ['solid', 'none'],
    cursor: ['pointer', 'not-allowed'],
    flexWrap: ['wrap', 'nowrap'],
    top: vars.sizes,
    bottom: vars.sizes,
    left: vars.sizes,
    right: vars.sizes,
    flexShrink: [0],
    flexGrow: [0, 1],
    zIndex: [-1, 0, 1],
    border: ['none'],
    outline: ['none'],
    textTransform: ['uppercase', 'lowercase', 'capitalize', 'none'],
    textDecoration: ['underline', 'none'],
    wordBreak: ['normal', 'keep-all', 'break-word', 'break-all'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { selector: `.${darkThemeClass} &` },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: { ...vars.colors, inherit: 'inherit' },
    background: { ...vars.colors, none: 'none' },
    backgroundColor: { ...vars.colors, transparent: 'transparent' },
    borderColor: vars.colors,
  },
  shorthands: {
    bg: ['backgroundColor'],
  },
});

const responsiveProperties = defineProperties({
  conditions: mapValues(breakpoints, (bp?: string) =>
    bp === '' ? {} : { '@media': bp },
  ),
  defaultCondition: 'xs',
  properties: {
    position: ['fixed', 'static', 'absolute', 'relative', 'sticky'],
    display: [
      'none',
      'flex',
      'block',
      'inline',
      'inline-block',
      'grid',
      'inline-flex',
    ],
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
    marginLeft: { ...vars.sizes, auto: 'auto' },
    marginRight: { ...vars.sizes, auto: 'auto' },
    width: {
      ...vars.sizes,
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    minWidth: {
      ...vars.sizes,
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    maxWidth: {
      '100%': '100%',
      maxContent: '42.5rem', // 680px
    },
    height: { ...vars.sizes, '100%': '100%', 'min-content': 'min-content' },
    gap: vars.sizes,
    gridGap: vars.sizes,
    overflow: ['hidden'],
    pointerEvents: ['none', 'auto'],
    opacity: [0, 1],
    textAlign: ['left', 'center', 'right'],
    fontSize: vars.fontSizes,
    fontWeight: vars.fontWeights,
    whiteSpace: ['nowrap', 'break-spaces', 'normal'],
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
