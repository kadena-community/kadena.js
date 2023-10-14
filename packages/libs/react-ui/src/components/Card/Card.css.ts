import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { createVar, style } from '@vanilla-extract/css';

const textColor = createVar();

export const container = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray10',
      darkMode: '$gray90',
    },
    color: {
      lightMode: '$gray100',
      darkMode: '$gray20',
    },
    paddingX: '$10',
    paddingY: '$6',
    borderRadius: '$sm',
    marginY: '$6',
    border: 'none',
    position: 'relative',
  }),
  {
    border: `1px solid ${vars.colors.$gray30}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        border: `1px solid ${vars.colors.$gray60}`,
      },
    },
  },
]);

export const fullWidthClass = style({
  width: '100%',
});

export const stackClass = style([
  sprinkles({ marginY: 0 }),
  {
    selectors: {
      '&:first-child': {
        borderRadius: `${vars.radii.$sm} ${vars.radii.$sm} 0 0`,
        borderBottom: 'none',
      },
      '&:last-child': {
        borderRadius: `0 0 ${vars.radii.$sm} ${vars.radii.$sm}`,
        borderTop: 'none',
      },
      '&:not(:last-child)': {
        marginBottom: 0,
      },
      '&:not(:first-child)': {
        marginTop: 0,
      },
      '&:not(:last-child):before': {
        content: '',
        position: 'absolute',
        left: vars.sizes.$lg,
        bottom: 0,
        height: '1px',
        width: `calc(100% - ${vars.sizes.$lg} - ${vars.sizes.$lg})`,
        borderBottom: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
      },
    },
  },
]);

export const disabledClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    pointerEvents: 'none',
  }),
  {
    border: `${vars.borderWidths.$md} solid ${vars.colors.$borderSubtle}`,

    vars: {
      [textColor]: vars.colors.$neutral3,
    },
  },
]);
