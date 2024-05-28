import { atoms, tokens } from '@kadena/react-ui/styles';
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
  }),
  {
    width: '68px',
    maxWidth: '100%',
    aspectRatio: '1 / 1',
    selectors: {
      '&.active': {
        border: `2px solid ${tokens.kda.foundation.color.palette.red.n50}`,
      },
    },
  },
]);
