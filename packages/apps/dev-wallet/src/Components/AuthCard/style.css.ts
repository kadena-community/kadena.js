import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const authCard = style([
  {
    width: '100%',
    borderRadius: '1px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${tokens.kda.foundation.color.border.base.default}`,
  },
]);

export const backButtonClass = style([
  atoms({
    textDecoration: 'none',
    color: 'text.base.default',
  }),
]);

export const iconStyle = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
  }),
]);
