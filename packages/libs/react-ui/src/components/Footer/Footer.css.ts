import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const footerVariants = styleVariants({
  web: [
    sprinkles({
      backgroundColor: '$neutral5',
      color: '$neutral3',
    }),
  ],
  application: [
    sprinkles({
      backgroundColor: { darkMode: '$neutral2', lightMode: '$neutral5' },
      color: { darkMode: '$neutral4', lightMode: '$neutral3' },
    }),
  ],
});
export const containerClass = style([
  sprinkles({
    maxWidth: { xs: 'maxContent', sm: '100%' },
    height: 'min-content',
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
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

export const linkBoxClass = style([
  sprinkles({
    display: 'flex',
    padding: 0,
    whiteSpace: 'nowrap',
  }),
]);

export const linkClass = style([
  sprinkles({
    display: 'flex',
    fontSize: '$xs',
    marginX: '$1',
    textDecoration: 'underline',
  }),
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
  }),
]);

export const iconTextClass = style([
  sprinkles({
    marginRight: '$1',
    fontSize: '$xs',
  }),
]);
