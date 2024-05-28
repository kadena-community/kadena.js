import { atoms, responsiveStyle } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const searchBoxClass = style({
  ...responsiveStyle({
    md: {
      width: 525,
    },
    sm: {
      width: 450,
    },
    xs: {
      width: 375,
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
    height: 50,
    border: 'none',
    ...responsiveStyle({
      md: {
        width: 375,
      },
      sm: {
        width: 300,
      },
      xs: {
        width: 250,
      },
    }),
  },
]);

export const searchBadgeBoxClass = style({
  ...responsiveStyle({
    md: {
      width: 150,
    },
    sm: {
      width: 100,
    },
    xs: {
      width: 75,
    },
  }),
});
