import { atoms } from '@kadena/kode-ui/styles';
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

export const editingBoxClass = style([
  atoms({
    position: 'absolute',
    display: 'grid',
    borderStyle: 'solid',
    borderWidth: 'hairline',
    backgroundColor: 'base.@active',
    fontSize: 'sm',
    fontFamily: 'primaryFont',
  }),
  {
    top: '45px',
    width: '100%',
  },
]);
