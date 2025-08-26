import { style } from '@kadena/kode-ui';

export const selectBoxClass = style({
  selectors: {
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});
