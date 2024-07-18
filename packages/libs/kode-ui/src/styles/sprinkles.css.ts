import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import mapValues from 'lodash.mapvalues';
import { breakpoints } from './themeUtils';
import { darkThemeClass, vars } from './vars.css';

const systemProperties = defineProperties({
  properties: {
    border: ['none'],
    borderRadius: vars.radii,
    borderStyle: ['solid', 'none'],
    borderWidth: vars.borderWidths,
    bottom: vars.sizes,
    boxShadow: vars.shadows,
    cursor: ['pointer', 'not-allowed'],
    flex: [1],
    flexGrow: [0, 1],
    flexShrink: [0],
    flexWrap: ['wrap', 'nowrap'],
    fontFamily: vars.fonts,
    inset: [0],
    left: vars.sizes,
    lineHeight: vars.lineHeights,
    listStyleType: ['none'],
    objectFit: ['cover', 'contain'],
    outline: ['none'],
    pointerEvents: ['none', 'auto', 'initial'],
    right: vars.sizes,
    textDecoration: ['underline', 'none'],
    textTransform: ['uppercase', 'lowercase', 'capitalize', 'none'],
    top: vars.sizes,
    wordBreak: ['normal', 'keep-all', 'break-word', 'break-all'],
    zIndex: [-1, 0, 1],
    whiteSpace: ['nowrap', 'break-spaces', 'normal', 'pre-wrap'],
    background: ['none'],
    overflow: ['hidden', 'visible', 'scroll', 'auto'],
    overflowY: ['hidden', 'visible', 'scroll', 'auto'],
    overflowX: ['hidden', 'visible', 'scroll', 'auto'],
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
    marginBlock: vars.sizes,
    marginInline: vars.sizes,
    marginBlockStart: vars.sizes,
    marginBlockEnd: vars.sizes,
    marginInlineStart: vars.sizes,
    marginInlineEnd: vars.sizes,
    paddingBlock: vars.sizes,
    paddingInline: vars.sizes,
    paddingBlockStart: vars.sizes,
    paddingBlockEnd: vars.sizes,
    paddingInlineStart: vars.sizes,
    paddingInlineEnd: vars.sizes,
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
      ...vars.contentWidth,
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    minWidth: {
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    maxWidth: {
      ...vars.contentWidth,
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    height: {
      ...vars.sizes,
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    minHeight: {
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    maxHeight: {
      '100%': '100%',
      'min-content': 'min-content',
      'max-content': 'max-content',
    },
    gap: vars.sizes,
    gridGap: vars.sizes,
    opacity: [0, 1],
    textAlign: ['left', 'center', 'right'],
    fontSize: vars.fontSizes,
    fontWeight: vars.fontWeights,
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

/**
 * @deprecated Use 'atoms' from '@kadena/kode-ui/styles'
 */
export const sprinkles = createSprinkles(
  systemProperties,
  colorProperties,
  responsiveProperties,
);

/**
 * @deprecated Use 'Atoms' from '@kadena/kode-ui/styles'
 */
export type Sprinkles = Parameters<typeof sprinkles>[0];
