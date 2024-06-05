import { atoms, responsiveStyle } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const searchBoxClass = style({
  ...responsiveStyle({
    md: {
      width: 525,
    },
    sm: {
      width: 475,
    },
    xs: {
      width: 325,
    },
  }),
});

export const searchInputClass = style([
  atoms({
    backgroundColor: 'base.default',
    fontSize: 'md',
    fontFamily: 'primaryFont',
    outline: 'none',
  }),
  {
    height: 55,
    border: 'none',
    width: '75%',
  },
]);

export const searchBadgeBoxClass = style({
  width: '20%',
});
