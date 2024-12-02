import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const buttonListClass = style([
  atoms({
    padding: 'sm',
    paddingInline: 'md',
    marginBlockStart: 'xs',
    textDecoration: 'none',
  }),
  {
    border: 'solid 1px transparent',
    cursor: 'pointer',
    flex: 1,
    background: tokens.kda.foundation.color.background.surface.default,
    selectors: {
      '&:hover': {
        background: tokens.kda.foundation.color.border.base.default,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&:disabled:hover': {
        background: tokens.kda.foundation.color.border.base.default,
      },
      '&.selected': {
        background: tokens.kda.foundation.color.border.base.default,
        border: `1px solid ${tokens.kda.foundation.color.border.base['@active']}`,
      },
    },
  },
]);
