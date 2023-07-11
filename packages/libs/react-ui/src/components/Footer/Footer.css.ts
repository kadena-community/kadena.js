import { ColorType, sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const footerVariants = styleVariants({
  web: [sprinkles({ width: '100%', maxWidth: '100%', flexDirection: 'row' })],
  mobile: [
    sprinkles({
      width: '100%',
      maxWidth: 'maxContent',
      flexDirection: 'column',
    }),
  ],
});

export const containerClass = style([
  sprinkles({
    height: 'min-content',
    backgroundColor: '$neutral5',
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: '$sm',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$negativeContrast,
      },
    },
  },
]);

export const footerPanel = style([
  sprinkles({
    background: '$neutral5',
    border: 'none',
    color: '$neutral3',
    alignItems: 'center',
    lineHeight: '$lg',
    display: 'flex',
    paddingX: '$4',
    paddingY: '$2',
    gap: '$2',
    flexGrow: 1,
  }),
  {
    selectors: {
      '&:first-child': {
        justifyContent: 'flex-start',
      },
      '&:last-child': {
        justifyContent: 'flex-end',
      },
    },
  },
]);

export const footerPanelVariants = styleVariants({
  web: [],
  mobile: [
    sprinkles({
      justifyContent: 'center',
    }),
    {
      selectors: {
        '&:first-child': {
          justifyContent: 'center',
        },
        '&:last-child': {
          justifyContent: 'center',
        },
      },
    },
  ],
});

export type ColorOptions =
  | ColorType
  | 'default'
  | 'inverted'
  | 'tertiary'
  | 'info';

const colors: Record<ColorOptions, ColorOptions> = {
  default: 'default',
  inverted: 'inverted',
  primary: 'primary',
  secondary: 'secondary',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
  tertiary: 'tertiary',
  info: 'info',
};

export const colorVariants = styleVariants(colors, (color) => {
  if (color === 'default') {
    return [containerClass, sprinkles({ color: '$neutral3' })];
  }

  if (color === 'inverted') {
    return [containerClass, sprinkles({ color: '$neutral2' })];
  }

  return [containerClass, sprinkles({ color: `$${color}Contrast` })];
});

export const linkBoxClass = style([
  sprinkles({
    display: 'flex',
    padding: 0,
  }),
  {
    whiteSpace: 'nowrap',
  },
]);

export const linkClass = style([
  sprinkles({
    display: 'flex',
    fontSize: '$xs',
    marginX: '$1',
  }),
  {
    textDecoration: 'underline',
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        textDecoration: 'none',
      },
    },
  },
]);

export const spanClass = style([
  sprinkles({
    marginRight: '$1',
  }),
]);

export const iconBoxClass = style([
  sprinkles({
    display: 'flex',
  }),
  {
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
]);

export const iconTextClass = style([
  sprinkles({
    marginRight: '$1',
    fontSize: '$xs',
  }),
]);
