import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const assetBoxClass = style([
  atoms({
    padding: 'sm',
    paddingInline: 'md',
    marginBlockStart: 'xs',
    textDecoration: 'none',
  }),
  {
    cursor: 'pointer',
    border: 'none',
    minHeight: '50px',
    // background: tokens.kda.foundation.color.background.surface.default,
    selectors: {
      '&:hover': {
        outline: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
        background: tokens.kda.foundation.color.background.surface.default,
      },
      '&.selected': {
        cursor: 'default',
        outline: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
        background: tokens.kda.foundation.color.background.surface.default,
      },
    },
  },
]);
