import { colorPalette, hexToRgba } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { createVar, style } from '@vanilla-extract/css';

const textColor = createVar();

export const container = style([
  sprinkles({
    backgroundColor: '$gray10',
    color: '$gray100',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingX: '$10',
    paddingY: '$6',
    borderRadius: '$sm',
    marginY: '$6',
    border: 'none',
    width: 'max-content',
    position: 'relative',
  }),
  {
    border: `1px solid ${hexToRgba(colorPalette.$gray40, 0.4)}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: hexToRgba(colorPalette.$gray60, 0.4),
        color: colorPalette.$gray20,
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
