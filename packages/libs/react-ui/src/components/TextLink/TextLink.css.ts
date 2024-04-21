import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';

export const textLinkClass = style([
  // buttonReset,
  atoms({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'xs',
    gap: 'sm',
    paddingBlock: 'sm',
  }),
  {
    selectors: {
      '&[data-hovered]': {
        textDecoration: 'underline',
        background: 'none',
      },
      // '&[data-pressed]': change color,
      '&[data-focus-visible]': { textDecoration: 'underline' },
      // '&[data-selected]': change color,
      '&[data-disabled]': {
        cursor: 'not-allowed',
      },
    },
  },
]);
