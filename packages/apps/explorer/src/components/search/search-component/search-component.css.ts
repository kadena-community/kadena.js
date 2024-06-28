import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const searchBoxClass = style({
  width: '100%',
});

export const searchInputClass = style([
  atoms({
    backgroundColor: 'base.default',
    fontSize: 'md',
    fontFamily: 'primaryFont',
    outline: 'none',
  }),
  {
    height: 46,
    border: 'none',
    width: '75%',
  },
]);

export const searchBadgeBoxClass = style({
  width: '20%',
});
