import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';
import { $$footerMenu, $$pageWidth } from '../../global.css';

export const footerWrapperClass = style([
  sprinkles({
    position: 'relative',
    backgroundColor: '$gray90',
  }),
  {
    marginBlockStart: vars.sizes.$40,
    zIndex: $$footerMenu,
    gridArea: 'footer',
  },
]);
export const logoClass = style({
  maxWidth: vars.sizes.$48,
});

export const footerClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: {
      xs: 'flex-start',
      md: 'center',
    },

    flexDirection: {
      xs: 'column',
      md: 'row',
    },
  }),
  {
    paddingBlock: vars.sizes.$3,
    paddingInline: vars.sizes.$4,
    margin: '0 auto',
    maxWidth: $$pageWidth,
  },
]);

export const textClass = style([
  sprinkles({
    display: 'block',
    color: '$gray40',
    textAlign: 'center',
  }),
  {
    paddingInline: vars.sizes.$3,
  },
]);

export const linkClass = style([
  sprinkles({
    display: 'block',
    textDecoration: 'none',
    color: '$gray40',
    textAlign: 'center',
  }),
  {
    paddingInline: vars.sizes.$3,
    selectors: {
      '&:hover': {
        textDecoration: 'none',
        color: vars.colors.$white,
      },
    },
  },
]);
