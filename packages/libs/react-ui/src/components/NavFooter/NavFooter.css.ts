import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    maxWidth: { xs: '$maxContent', sm: '100%' },
    height: 'min-content',
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: '$layoutSurfaceSubtle',
    color: '$gray40',
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
    width: 'max-content',
    border: 'none',
    alignItems: 'center',
    lineHeight: '$lg',
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    paddingX: '$4',
    paddingY: '$2',
    gap: '$2',
    justifyContent: 'center',
    marginX: {
      xs: 'auto',
      sm: 0,
    },
  }),
]);

export const linkClass = style([
  sprinkles({
    display: 'flex',
    fontSize: '$xs',
    marginX: '$1',
    textDecoration: 'underline',
    color: 'inherit',
  }),
  {
    textDecorationColor: 'inherit',
  },
  {
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

export const iconButtonClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer',
    color: '$gray40',
  }),
]);

export const iconTextClass = style([
  sprinkles({
    marginRight: '$1',
    fontSize: '$xs',
  }),
]);
