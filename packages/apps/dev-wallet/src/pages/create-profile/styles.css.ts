import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'space-between',
    listStyleType: 'none',
    padding: 'n0',
    width: '100%',
    marginBlockEnd: 'xxxl',
    marginBlockStart: 'sm',
  }),
]);

export const colorOptionClass = style([
  atoms({
    borderRadius: 'xs',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    width: '68px',
    maxWidth: '100%',
    aspectRatio: '1 / 1',
  },
]);
