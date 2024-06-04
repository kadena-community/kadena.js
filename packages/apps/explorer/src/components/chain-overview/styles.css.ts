import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const chainOverviewClass = style([
  atoms({
    border: 'hairline',
    padding: 'no',
  }),
  {
    overflowX: 'scroll',
  },
]);
export const chainClass = style([
  atoms({
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    minWidth: '60px',
    aspectRatio: '1/1',
    flex: 1,
    borderInlineEnd: `${tokens.kda.foundation.border.hairline}`,
    selectors: {
      '&:last-child': {
        borderInlineStart: 0,
      },
    },
  },
]);
