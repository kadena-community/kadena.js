import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';
import { $$footerMenu, $$pageWidth } from '../../global.css';

export const footerWrapperClass = style([
  sprinkles({
    position: 'relative',
    background: '$gray90',
    marginTop: '$40',
  }),
  {
    zIndex: $$footerMenu,
    gridArea: 'footer',
  },
]);

export const footerClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: {
      xs: 'flex-start',
      md: 'center',
    },
    paddingY: '$3',
    paddingX: '$4',

    flexDirection: {
      xs: 'column',
      md: 'row',
    },
  }),
  {
    margin: '0 auto',
    maxWidth: $$pageWidth,
  },
]);

export const textClass = style([
  sprinkles({
    display: 'block',
    color: '$gray40',
    paddingX: '$3',
    textAlign: 'center',
  }),
]);

export const linkClass = style([
  sprinkles({
    display: 'block',
    textDecoration: 'none',
    color: '$gray40',
    paddingX: '$3',
    textAlign: 'center',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
        color: vars.colors.$white,
      },
    },
  },
]);
