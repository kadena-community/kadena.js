import { atoms, responsiveStyle } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  atoms({
    display: 'flex',
    padding: 'no',
    width: '100%',
    flexWrap: 'wrap',
  }),
  {
    listStyle: 'none',
  },
]);

export const itemClass = style([
  atoms({
    display: 'flex',
    width: '100%',
    paddingInline: 'sm',
  }),
  {
    flex: '100%',
    ...responsiveStyle({
      sm: {
        flex: '50%',
      },
      lg: {
        flex: '33%',
      },
      xl: {
        flex: '25%',
      },
    }),
  },
]);
export const itemLinkClass = style([
  atoms({
    display: 'block',
    width: '100%',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);
export const headingClass = style({
  textTransform: 'capitalize',
});
